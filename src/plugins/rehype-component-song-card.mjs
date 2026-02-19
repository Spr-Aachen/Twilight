/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a Song Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.title - The title of the song.
 * @param {string} properties.artist - The artist of the song.
 * @param {string} properties.audio - The audio source URL.
 * @param {string} properties.cover - The cover image URL.
 * @param {string} properties.lrc - The lyrics URL.
 * @param {import('mdast').RootContent[]} children - The children elements (lyrics text).
 * @returns {import('mdast').Parent} The created Song Card component.
 */
export function SongCardComponent(properties, children) {
    // Helper to resolve paths
    const resolvePath = (path) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        if (path.startsWith("/")) return path;
        return "/" + path;
    };

    const title = properties.title || "Unknown Title";
    const artist = properties.artist || "Unknown Artist";
    const audioSrc = resolvePath(properties.audio);
    const coverSrc = resolvePath(properties.cover);
    const lrcSrc = resolvePath(properties.lrc);
    
    // Extract inline lyrics if present in children
    let inlineLyrics = "";
    if (children && children.length > 0) {
        // Simple extraction of text from children
        inlineLyrics = children.map(child => {
            if (child.type === 'text') return child.value;
            if (child.children) return child.children.map(c => c.value).join('');
            return '';
        }).join('\n').trim();
    }

    const cardUuid = `SC${Math.random().toString(36).slice(-6)}`;

    // Create the HTML structure
    const nCover = h("div", { 
        class: "song-cover", 
        style: `background-image: url('${coverSrc}');` 
    });

    const nTitle = h("div", { class: "song-title" }, title);
    const nArtist = h("div", { class: "song-artist" }, artist);
    const nHeader = h("div", { class: "song-header" }, [nTitle, nArtist]);

    const nLyric = h("div", { class: "song-lyric", id: `${cardUuid}-lyric` }, [
        h("div", { class: "lyric-placeholder" }, "Loading lyrics...")
    ]);

    const nPlayBtn = h("button", { class: "play-btn", id: `${cardUuid}-play`, "aria-label": "Play/Pause" }, [
        // Play Icon (SVG)
        h("svg", { viewBox: "0 0 24 24", class: "play-icon" }, [
            h("path", { d: "M8 5v14l11-7z" })
        ]),
        // Pause Icon (SVG) - initially hidden via CSS or JS? 
        h("svg", { viewBox: "0 0 24 24", class: "pause-icon", style: "display: none;" }, [
            h("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" })
        ])
    ]);

    const nProgressBar = h("div", { class: "progress-bar", id: `${cardUuid}-progress-bar` });
    const nProgressContainer = h("div", { class: "progress-container", id: `${cardUuid}-progress-container` }, [nProgressBar]);
    
    const nTimeDisplay = h("div", { class: "time-display", id: `${cardUuid}-time` }, "0:00 / 0:00");

    const nControls = h("div", { class: "song-controls" }, [
        nPlayBtn,
        nProgressContainer,
        nTimeDisplay
    ]);

    const nInfo = h("div", { class: "song-info" }, [
        nHeader,
        nLyric,
        nControls
    ]);

    const nAudio = h("audio", { 
        id: `${cardUuid}-audio`,
        src: audioSrc,
        preload: "metadata"
    });

    // Client-side script logic
    const scriptContent = `
    (function() {
        const cardId = '${cardUuid}';
        const audio = document.getElementById(cardId + '-audio');
        const playBtn = document.getElementById(cardId + '-play');
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        const progressContainer = document.getElementById(cardId + '-progress-container');
        const progressBar = document.getElementById(cardId + '-progress-bar');
        const timeDisplay = document.getElementById(cardId + '-time');
        const lyricEl = document.getElementById(cardId + '-lyric');
        
        let isPlaying = false;
        let lyrics = [];
        const inlineLyrics = ${JSON.stringify(inlineLyrics)};
        const lrcSrc = '${lrcSrc}';

        function formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return "0:00";
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ":" + (secs < 10 ? "0" : "") + secs;
        }

        function parseLRC(lrc) {
            const result = [];
            // Split by timestamp: [mm:ss.xx]
            const parts = lrc.split(/(\\[\\d{2}:\\d{2}\\.\\d{2,3}\\])/);
            for (let i = 1; i < parts.length; i += 2) {
                const timeStr = parts[i];
                const text = parts[i+1] ? parts[i+1].trim() : "";
                
                const timeMatch = timeStr.match(/\\[(\\d{2}):(\\d{2})\\.(\\d{2,3})\\]/);
                if (timeMatch) {
                     const m = parseInt(timeMatch[1]);
                     const s = parseInt(timeMatch[2]);
                     const ms = parseInt(timeMatch[3]);
                     const time = m * 60 + s + ms / (timeMatch[3].length === 3 ? 1000 : 100);
                     result.push({ time, text });
                }
            }
            return result.sort((a, b) => a.time - b.time);
        }

        async function loadLyrics() {
            let lrcText = inlineLyrics;
            if (!lrcText && lrcSrc) {
                try {
                    const res = await fetch(lrcSrc);
                    if (res.ok) lrcText = await res.text();
                } catch (e) { console.error('Failed to load lyrics', e); }
            }
            if (lrcText) {
                lyrics = parseLRC(lrcText);
                if (lyrics.length > 0) lyricEl.innerText = lyrics[0].text;
            } else {
                lyricEl.innerText = "${title} - ${artist}";
            }
        }

        function updatePlayState() {
            if (isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                audio.play();
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                audio.pause();
            }
        }

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent bubbling
            isPlaying = !isPlaying;
            updatePlayState();
        });

        audio.addEventListener('timeupdate', () => {
            const current = audio.currentTime;
            const duration = audio.duration || 0;
            const percent = duration > 0 ? (current / duration) * 100 : 0;
            progressBar.style.width = percent + '%';
            timeDisplay.innerText = formatTime(current) + ' / ' + formatTime(duration);

            // Update lyrics
            if (lyrics.length > 0) {
                let activeLyric = lyrics[0].text;
                for (let i = 0; i < lyrics.length; i++) {
                    if (current >= lyrics[i].time) {
                        activeLyric = lyrics[i].text;
                    } else {
                        break;
                    }
                }
                lyricEl.innerText = activeLyric;
            }
        });

        audio.addEventListener('ended', () => {
            isPlaying = false;
            updatePlayState();
            progressBar.style.width = '0%';
            timeDisplay.innerText = "0:00 / " + formatTime(audio.duration);
            if (lyrics.length > 0) lyricEl.innerText = lyrics[0].text;
        });
        
        audio.addEventListener('loadedmetadata', () => {
             timeDisplay.innerText = "0:00 / " + formatTime(audio.duration);
        });

        progressContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = progressContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            const percent = x / width;
            const duration = audio.duration || 0;
            audio.currentTime = percent * duration;
        });

        loadLyrics();
    })();
    `;

    const nScript = h("script", { type: "text/javascript" }, scriptContent);

    return h("div", { class: "card-song", id: `${cardUuid}-card` }, [
        nCover,
        nInfo,
        nAudio,
        nScript
    ]);
}