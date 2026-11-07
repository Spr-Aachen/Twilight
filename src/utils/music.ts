import { i18n } from "@i18n/translation";
import Key from "@i18n/i18nKey";
import type { MusicPlayerTrack } from "@/types/config";

// Storage keys for local storage
export const STORAGE_KEYS = {
    VOLUME: "player_volume",
    SHUFFLE: "player_shuffle",
    REPEAT: "player_repeat",
    LAST_SONG_ID: "player_last_song_id",
    LAST_SONG_PROGRESS: "player_last_song_progress",
};

/**
 * Format seconds to MM:SS string
 */
export function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * Get absolute asset path
 */
export function getAssetPath(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return path;
    return `/${path}`;
}

/**
 * Parse LRC string into time-text objects
 */
export function parseLRC(lrc: string): { time: number; text: string }[] {
    if (!lrc) return [];
    const lines = lrc.split('\n');
    const result: { time: number; text: string }[] = [];
    const timeRegDot = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/g;
    const timeRegColon = /\[(\d{2}):(\d{2}):(\d{2})\]/g;
    lines.forEach(line => {
        let text = line.trim();
        const dotMatches = Array.from(line.matchAll(timeRegDot));
        const colonMatches = Array.from(line.matchAll(timeRegColon));
        if (dotMatches.length > 0) {
            text = line.replace(timeRegDot, '').trim();
            dotMatches.forEach(match => {
                const m = parseInt(match[1]);
                const s = parseInt(match[2]);
                const ms = parseInt(match[3]);
                const time = m * 60 + s + ms / (match[3].length === 3 ? 1000 : 100);
                result.push({ time, text });
            });
        }
        if (colonMatches.length > 0) {
            text = line.replace(timeRegColon, '').trim();
            colonMatches.forEach(match => {
                const m = parseInt(match[1]);
                const s = parseInt(match[2]);
                const ms = parseInt(match[3]);
                const time = m * 60 + s + ms / 100;
                result.push({ time, text });
            });
        }
    });
    return result.sort((a, b) => a.time - b.time);
}

/**
 * Fetch lyrics from a URL or return raw text
 */
export async function fetchLyrics(lrcSource: string): Promise<string> {
    if (!lrcSource) return "";
    
    const assetPath = getAssetPath(lrcSource);
    
    if (assetPath.startsWith('http') || assetPath.startsWith('/')) {
         try {
             const res = await fetch(assetPath);
             if (res.ok) {
                 return await res.text();
             }
         } catch {
             // 歌词失败静默降级，避免在控制台产生 errors-in-console
         }
    } else {
        return lrcSource;
    }
    return "";
}

// Netease 的封面 URL 默认返回原图，显示尺寸只有 40–64px，用 `param` 让 CDN 直接返回缩略图。
const NETEASE_COVER_HOST = /^(?:https?:)?\/\/[^/]*music\.126\.net\//;

export function getCoverThumbnail(url: string, size = 128): string {
    if (!url || !NETEASE_COVER_HOST.test(url)) return url;
    const separator = url.includes("?") ? "&" : "?";
    return `${url}${separator}param=${size}y${size}`;
}

/**
 * Fetch playlist from Meting API
 */
export async function fetchMetingPlaylist(
    api: string,
    server: string,
    type: string,
    id: string
): Promise<MusicPlayerTrack[]> {
    if (!api || !id) return [];
    
    const query = new URLSearchParams({
        server: server,
        type: type,
        id: id,
    });
    const separator = api.includes("?") ? "&" : "?";
    const apiUrl = `${api}${separator}${query.toString()}`;
    
    const res = await fetch(apiUrl);
    if (!res.ok) throw new Error("meting api error");
    const list = await res.json();
    
    return list.map((song: any, index: number) => {
        let title = song.title ?? song.name ?? i18n(Key.musicUnknownTrack);
        let author = song.author ?? song.artist ?? i18n(Key.musicUnknownArtist);
        let cover = getCoverThumbnail(song.pic ?? song.cover ?? "");
        let dur = song.duration ?? 0;
        if (dur > 10000) dur = Math.floor(dur / 1000);
        if (!Number.isFinite(dur) || dur <= 0) dur = 0;
        return {
            id: song.id ?? `meting-${index}`,
            title,
            author,
            cover,
            url: song.url ?? "",
            lrc: song.lrc ?? "",
            duration: dur,
        };
    });
}

/**
 * Fade in audio volume
 * Returns the interval ID so it can be cleared
 */
export function fadeInAudio(
    audio: HTMLAudioElement,
    targetVolume: number,
    duration: number = 2000,
    onComplete?: () => void
): number | null {
    if (!audio) return null;
    
    const startVolume = 0;
    const startTime = Date.now();
    audio.volume = startVolume;
    
    const interval = window.setInterval(() => {
        // Check if audio element still exists and is valid
        if (!audio || audio.muted) {
            clearInterval(interval);
            return;
        }
        
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentVolume = startVolume + (targetVolume - startVolume) * progress;
        
        // Ensure volume doesn't exceed 1 or go below 0
        audio.volume = Math.max(0, Math.min(1, currentVolume));
        
        if (progress >= 1) {
            clearInterval(interval);
            if (onComplete) onComplete();
        }
    }, 50);
    
    return interval;
}