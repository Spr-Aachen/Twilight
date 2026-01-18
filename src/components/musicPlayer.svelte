<script lang="ts">
import { onDestroy, onMount } from "svelte";
import { slide } from "svelte/transition";
import Icon from "@iconify/svelte";

import type { MusicPlayerTrack } from "@/types/config";
import { musicPlayerConfig } from "@/config";
import { i18n } from "@i18n/translation";
import Key from "@i18n/i18nKey";
import "@styles/musicplayer.css";


// 音乐播放器模式，可选 "local" 或 "meting"
let mode = $state(musicPlayerConfig.mode ?? "meting");
// Meting API 地址，从配置中获取或使用默认值
let meting_api = musicPlayerConfig.meting?.meting_api ?? "https://api.i-meto.com/meting/api";
// Meting API 的数据源，从配置中获取或使用默认值
let meting_server = musicPlayerConfig.meting?.server ?? "netease";
// Meting API 的类型，从配置中获取或使用默认值
let meting_type = musicPlayerConfig.meting?.type ?? "playlist";
// Meting API 的 ID，从配置中获取或使用默认值
let meting_id = musicPlayerConfig.meting?.id ?? "2161912966";
// 是否启用自动播放，从配置中获取或使用默认值
let isAutoplayEnabled = $state(musicPlayerConfig.autoplay ?? false);

// 当前歌曲信息
let currentSong: MusicPlayerTrack = $state({
    id: 0,
    title: "Music",
    artist: "Artist",
    cover: "/favicon/icon-light.ico",
    url: "",
    duration: 0,
});
let playlist: MusicPlayerTrack[] = $state([]);
let currentIndex = $state(0);
let audio: HTMLAudioElement | undefined = $state();
let progressBar: HTMLElement | undefined = $state();
let volumeBar: HTMLElement | undefined = $state();

// 是否正在播放
let isPlaying = $state(false);
// 是否应该播放（用于切换歌曲时的自动播放）
let shouldPlay = $state(false);
// 是否折叠播放器
let isCollapsed = $state(true);
// 是否显示播放列表
let showPlaylist = $state(false);
// 当前播放时间
let currentTime = $state(0);
// 歌曲总时长
let duration = $state(0);
// 音量
let volume = $state(0.75);
// 是否静音
let isMuted = $state(false);
// 是否正在加载
let isLoading = $state(false);
// 是否随机播放
let isShuffled = $state(false);
// 循环模式，0: 不循环, 1: 单曲循环, 2: 列表循环
let isRepeating = $state(0);
// 待恢复的进度
let pendingProgress = $state(0);
// 上次保存进度的时间，用于节流
let lastSaveTime = 0;
// 错误信息
let errorMessage = $state("");
// 是否显示错误信息
let showError = $state(false);

// 存储键名常量
const STORAGE_KEYS = {
    USER_PAUSED: "player_user_paused",
    VOLUME: "player_volume",
    SHUFFLE: "player_shuffle",
    REPEAT: "player_repeat",
    LAST_SONG_ID: "player_last_song_id",
    LAST_SONG_PROGRESS: "player_last_song_progress",
};

function restoreLastSong() {
    if (playlist.length === 0) return;

    if (typeof localStorage !== 'undefined') {
        const lastId = localStorage.getItem(STORAGE_KEYS.LAST_SONG_ID);
        let index = -1;
        // 优先通过 ID 匹配
        if (lastId) {
            index = playlist.findIndex(s => s.id !== undefined && String(s.id) === String(lastId));
        }
        if (index !== -1) {
            currentIndex = index;
            // 获取保存的进度
            const savedProgress = localStorage.getItem(STORAGE_KEYS.LAST_SONG_PROGRESS);
            if (savedProgress) {
                pendingProgress = parseFloat(savedProgress);
            }
            loadSong(playlist[currentIndex]);
            return;
        }
    }
    // 如果没有找到上次播放的歌曲，或者没有记录，加载第一首
    currentIndex = 0;
    loadSong(playlist[0]);
}

function showErrorMessage(message: string) {
    errorMessage = message;
    showError = true;
    setTimeout(() => {
        showError = false;
    }, 3000);
}

async function fetchMetingPlaylist() {
    if (!meting_api || !meting_id) return;
    isLoading = true;
    const query = new URLSearchParams({
        server: meting_server,
        type: meting_type,
        id: meting_id,
    });
    const separator = meting_api.includes("?") ? "&" : "?";
    const apiUrl = `${meting_api}${separator}${query.toString()}`;
    try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("meting api error");
        const list = await res.json();
        playlist = list.map((song: any, index: number) => {
            let title = song.name ?? song.title ?? "未知歌曲";
            let artist = song.artist ?? song.author ?? "未知艺术家";
            let dur = song.duration ?? 0;
            if (dur > 10000) dur = Math.floor(dur / 1000);
            if (!Number.isFinite(dur) || dur <= 0) dur = 0;
            return {
                id: song.id ?? `meting-${index}`, // 确保每个歌曲都有 ID
                title,
                artist,
                cover: song.pic ?? "",
                url: song.url ?? "",
                duration: dur,
            };
        });
        if (playlist.length > 0) {
            // 使用 setTimeout 确保 Svelte 响应式变量已更新
            setTimeout(() => {
                restoreLastSong();
            }, 0);
        }
        isLoading = false;
    } catch (e) {
        showErrorMessage("Meting 歌单获取失败");
        isLoading = false;
    }
}

async function toggleMode() {
    if (!musicPlayerConfig.enable) return;
    mode = mode === "meting" ? "local" : "meting";
    showPlaylist = false;
    isLoading = false;
    isPlaying = false;
    currentIndex = 0;
    playlist = [];
    if (audio) {
        audio.pause();
        audio.currentTime = 0;
    }
    currentTime = 0;
    duration = 0;
    if (mode === "meting") {
        await fetchMetingPlaylist();
    } else {
        playlist = [...(musicPlayerConfig.local?.playlist ?? [])];
        if (playlist.length > 0) {
            setTimeout(() => {
                restoreLastSong();
            }, 0);
        } else {
            showErrorMessage("本地播放列表为空");
        }
    }
}

function togglePlay() {
    if (!audio || !currentSong.url) return;
    if (isPlaying) {
        audio.pause();
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER_PAUSED, "true");
        }
    } else {
        audio.play();
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER_PAUSED, "false");
        }
    }
}

function toggleCollapse() {
    isCollapsed = !isCollapsed;
    if (isCollapsed) {
        showPlaylist = false;
    }
}

function togglePlaylist() {
    showPlaylist = !showPlaylist;
}

function toggleShuffle() {
    isShuffled = !isShuffled;
    if (isShuffled) {
        isRepeating = 0;
    }
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.SHUFFLE, String(isShuffled));
        localStorage.setItem(STORAGE_KEYS.REPEAT, String(isRepeating));
    }
}

function toggleRepeat() {
    isRepeating = (isRepeating + 1) % 3;
    if (isRepeating !== 0) {
        isShuffled = false;
    }
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.REPEAT, String(isRepeating));
        localStorage.setItem(STORAGE_KEYS.SHUFFLE, String(isShuffled));
    }
}

function previousSong() {
    if (playlist.length <= 1) return;
    const newIndex = currentIndex > 0 ? currentIndex - 1 : playlist.length - 1;
    playSong(newIndex);
}

function nextSong() {
    if (playlist.length <= 1) return;
    let newIndex: number;
    if (isShuffled) {
        do {
            newIndex = Math.floor(Math.random() * playlist.length);
        } while (newIndex === currentIndex && playlist.length > 1);
    } else {
        newIndex = currentIndex < playlist.length - 1 ? currentIndex + 1 : 0;
    }
    playSong(newIndex);
}

function playSong(index: number) {
    if (index < 0 || index >= playlist.length) return;
    currentIndex = index;
    // 用户手动选择歌曲（或自动切换），标记为应该播放
    shouldPlay = true;
    // 用户手动选择歌曲，清除暂停偏好和待恢复进度
     if (typeof localStorage !== 'undefined') {
         localStorage.setItem(STORAGE_KEYS.USER_PAUSED, "false");
     }
    pendingProgress = 0;
    // 加载歌曲
    loadSong(playlist[currentIndex]);
}

function getAssetPath(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    if (path.startsWith("/")) return path;
    return `/${path}`;
}

function loadSong(song: MusicPlayerTrack) {
    if (!song || !audio) return;
    currentSong = { ...song };
    // 记录最后播放的歌曲 ID (排除初始化的占位符 ID 0)
    if (typeof localStorage !== 'undefined' && song.id !== undefined && song.id !== 0) {
        localStorage.setItem(STORAGE_KEYS.LAST_SONG_ID, String(song.id));
        // 如果不是恢复进度的情况，重置保存的进度
        if (pendingProgress <= 0) {
            localStorage.setItem(STORAGE_KEYS.LAST_SONG_PROGRESS, "0");
        }
    }
    if (song.url) {
        isLoading = true;
        // 如果有待恢复的进度，先不要重置为 0，以免进度条跳变
        if (pendingProgress > 0) {
            currentTime = pendingProgress;
        } else {
            audio.currentTime = 0;
            currentTime = 0;
        }
        duration = song.duration ?? 0;
        audio.removeEventListener("canplay", handleLoadSuccess);
        audio.removeEventListener("error", handleLoadError);
        audio.removeEventListener("loadstart", handleLoadStart);
        audio.addEventListener("canplay", handleLoadSuccess, { once: true });
        audio.addEventListener("error", handleLoadError, { once: true });
        audio.addEventListener("loadstart", handleLoadStart, { once: true });
        audio.src = getAssetPath(song.url);
        audio.load();
    } else {
        isLoading = false;
    }
}

let autoplayFailed = $state(false);

function handleLoadSuccess() {
    isLoading = false;
    if (audio?.duration && audio.duration > 1) {
        duration = Math.floor(audio.duration);
        if (playlist[currentIndex]) playlist[currentIndex].duration = duration;
        currentSong.duration = duration;
    }
    // 恢复进度
    if (pendingProgress > 0 && audio) {
        // 确保进度不超出总时长
        const targetTime = Math.min(pendingProgress, duration > 0 ? duration : Infinity);
        audio.currentTime = targetTime;
        currentTime = targetTime;
        pendingProgress = 0; // 恢复后清除
    }
    // 如果是自动播放模式，或者当前处于播放状态（如切换歌曲），则尝试播放
    if (isAutoplayEnabled || isPlaying || shouldPlay) {
        const playPromise = audio?.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // 播放成功后，关闭自动播放标记，后续由用户控制
                isAutoplayEnabled = false;
                autoplayFailed = false;
                shouldPlay = false;
            }).catch((error) => {
                showErrorMessage("自动播放被拦截");
                autoplayFailed = true;
                // 确保 UI 状态为暂停
                isPlaying = false;
                shouldPlay = false;
            });
        }
    }
}

function handleUserInteraction() {
    // 如果自动播放失败且尚未开始播放，则在用户交互时尝试播放
    if (autoplayFailed && audio && !isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                autoplayFailed = false;
            }).catch(() => {});
        }
    }
}

function handleLoadError(event: Event) {
    isLoading = false;
    showErrorMessage(`无法播放 "${currentSong.title}"，正在尝试下一首...`);
    if (playlist.length > 1) setTimeout(() => nextSong(), 1000);
    else showErrorMessage("播放列表中没有可用的歌曲");
}

function handleLoadStart() {}

function hideError() {
    showError = false;
}

function setProgress(event: MouseEvent) {
    if (!audio || !progressBar) return;
    const rect = progressBar.getBoundingClientRect();
    const percent = (event.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    audio.currentTime = newTime;
    currentTime = newTime;
}

let isVolumeDragging = $state(false);
let isMouseDown = $state(false);
let volumeBarRect: DOMRect | null = $state(null);
let rafId: number | null = $state(null);

function startVolumeDrag(event: MouseEvent) {
    if (!volumeBar) return;
    isMouseDown = true;
    volumeBarRect = volumeBar.getBoundingClientRect();
    updateVolumeLogic(event.clientX);
}

function handleVolumeMove(event: MouseEvent) {
    if (!isMouseDown) return;
    isVolumeDragging = true;
    if (rafId) return;
    rafId = requestAnimationFrame(() => {
        updateVolumeLogic(event.clientX);
        rafId = null;
    });
}

function stopVolumeDrag() {
    isMouseDown = false;
    isVolumeDragging = false;
    volumeBarRect = null;
    if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
    }
}

function updateVolumeLogic(clientX: number) {
    if (!audio || !volumeBar) return;
    const rect = volumeBarRect || volumeBar.getBoundingClientRect();
    const percent = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width),
    );
    volume = percent;
    audio.volume = volume;
    isMuted = volume === 0;
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.VOLUME, String(volume));
    }
}

function toggleMute() {
    if (!audio) return;
    isMuted = !isMuted;
    audio.muted = isMuted;
}

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function handleAudioEvents() {
    if (!audio) return;
    audio.addEventListener("play", () => {
        isPlaying = true;
        autoplayFailed = false;
        isAutoplayEnabled = false;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.USER_PAUSED, "false");
        }
    });
    audio.addEventListener("pause", () => {
        isPlaying = false;
        // 注意：这里不自动设置 userPaused 为 true，因为音频结束或切换也可能触发 pause。（只在 togglePlay 中显式记录用户的暂停操作。）
    });
    audio.addEventListener("timeupdate", () => {
        if (!audio) return;
        currentTime = audio.currentTime;
        // 每 2.1 秒保存一次进度，或者在歌曲接近结束时（虽然结束时可能不需要记忆，但为了保险）
        const now = Date.now();
        if (now - lastSaveTime > 2100) {
            if (typeof localStorage !== 'undefined' && currentSong.id !== 0) {
                localStorage.setItem(STORAGE_KEYS.LAST_SONG_PROGRESS, String(currentTime));
                lastSaveTime = now;
            }
        }
    });
    audio.addEventListener("ended", () => {
        if (!audio) return;
        // 歌曲结束，重置保存的进度
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem(STORAGE_KEYS.LAST_SONG_PROGRESS, "0");
        }
        // 单曲循环时，重置进度到开始
        if (isRepeating === 1) {
            audio.currentTime = 0;
            audio.play().catch(() => {});
        } else if (
            isRepeating === 2 ||
            isShuffled ||
            (isRepeating === 0 && currentIndex < playlist.length - 1)
        ) {
            nextSong();
        } else {
            isPlaying = false;
        }
    });
    audio.addEventListener("error", (event) => {
        isLoading = false;
    });
    audio.addEventListener("stalled", () => {});
    audio.addEventListener("waiting", () => {});
}

const interactionEvents = ['click', 'keydown', 'touchstart'];

onMount(() => {
    // 从缓存中读取用户偏好
    if (typeof localStorage !== 'undefined') {
        const userPaused = localStorage.getItem(STORAGE_KEYS.USER_PAUSED) === "true";
        if (userPaused) {
            isAutoplayEnabled = false;
        }
        const savedVolume = localStorage.getItem(STORAGE_KEYS.VOLUME);
        if (savedVolume !== null) {
            volume = parseFloat(savedVolume);
        }
        const savedShuffle = localStorage.getItem(STORAGE_KEYS.SHUFFLE);
        if (savedShuffle !== null) {
            isShuffled = savedShuffle === "true";
        }
        const savedRepeat = localStorage.getItem(STORAGE_KEYS.REPEAT);
        if (savedRepeat !== null) {
            isRepeating = parseInt(savedRepeat);
        }
    }

    audio = new Audio();
    audio.volume = volume;
    handleAudioEvents();
    interactionEvents.forEach(event => {
        document.addEventListener(event, handleUserInteraction, { capture: true });
    });
    if (!musicPlayerConfig.enable) {
        return;
    }
    if (mode === "meting") {
        fetchMetingPlaylist();
    } else {
        // 使用本地播放列表，不发送任何API请求
        playlist = [...(musicPlayerConfig.local?.playlist ?? [])];
        if (playlist.length > 0) {
            setTimeout(() => {
                restoreLastSong();
            }, 0);
        } else {
            showErrorMessage("本地播放列表为空");
        }
    }
});

onDestroy(() => {
    if (typeof document !== 'undefined') {
        interactionEvents.forEach(event => {
            document.removeEventListener(event, handleUserInteraction, { capture: true });
        });
    }
    if (audio) {
        audio.pause();
        audio.src = "";
    }
});
</script>

<svelte:window
    onmousemove={handleVolumeMove}
    onmouseup={stopVolumeDrag}
/>

{#if musicPlayerConfig.enable}
{#if showError}
<div class="music-player-error fixed bottom-20 right-4 z-[60] max-w-sm onload-animation-up">
    <div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up">
        <Icon icon="material-symbols:error" class="text-xl flex-shrink-0" />
        <span class="text-sm flex-1">{errorMessage}</span>
        <button onclick={hideError} class="text-white/80 hover:text-white transition-colors">
            <Icon icon="material-symbols:close" class="text-lg" />
        </button>
    </div>
</div>
{/if}

<div class="music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out onload-animation-up"
     class:expanded={!isCollapsed}
     class:collapsed={isCollapsed}>
    <!-- 折叠状态的小圆球 -->
    <div class="orb-player w-12 h-12 bg-[var(--primary)] rounded-full shadow-lg cursor-pointer transition-all duration-500 ease-in-out flex items-center justify-center hover:scale-110 active:scale-95"
         class:opacity-0={!isCollapsed}
         class:scale-0={!isCollapsed}
         class:pointer-events-none={!isCollapsed}
         onclick={toggleCollapse}
         onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleCollapse();
            }
         }}
         role="button"
         tabindex="0"
         aria-label="展开音乐播放器">
        {#if isLoading}
            <Icon icon="eos-icons:loading" class="text-white text-lg" />
        {:else if isPlaying}
            <div class="flex space-x-0.5">
                <div class="w-0.5 h-3 bg-white rounded-full animate-pulse"></div>
                <div class="w-0.5 h-4 bg-white rounded-full animate-pulse" style="animation-delay: 150ms;"></div>
                <div class="w-0.5 h-2 bg-white rounded-full animate-pulse" style="animation-delay: 300ms;"></div>
            </div>
        {:else}
            <Icon icon="material-symbols:music-note" class="text-white text-lg" />
        {/if}
    </div>
    <!-- 展开状态的完整播放器（封面圆形） -->
    <div class="expanded-player card-base bg-[var(--float-panel-bg)] shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out"
         class:opacity-0={isCollapsed}
         class:scale-95={isCollapsed}
         class:pointer-events-none={isCollapsed}>
        <div class="flex items-center gap-4 mb-4">
            <div class="cover-container relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                <img src={getAssetPath(currentSong.cover)} alt="封面"
                     class="w-full h-full object-cover transition-transform duration-300"
                     class:spinning={isPlaying && !isLoading}
                     class:animate-pulse={isLoading} />
            </div>
            <div class="flex-1 min-w-0">
                <div class="song-title text-lg font-bold text-90 truncate mb-1">{currentSong.title}</div>
                <div class="song-artist text-sm text-50 truncate">{currentSong.artist}</div>
                <div class="text-xs text-30 mt-1">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>
            <div class="flex items-center gap-1">
                <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
                        onclick={toggleMode}
                        title={mode === "meting" ? "切换到 Local 模式" : "切换到 Meting 模式"}>
                    <Icon icon={mode === "meting" ? "material-symbols:cloud" : "material-symbols:folder"} class="text-lg" />
                </button>
                <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
                        class:text-[var(--primary)]={showPlaylist}
                        onclick={togglePlaylist}
                        title="播放列表">
                    <Icon icon="material-symbols:queue-music" class="text-lg" />
                </button>
            </div>
        </div>
        <div class="progress-section mb-4">
            <div class="progress-bar flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer"
                bind:this={progressBar}
                onclick={setProgress}
                onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        const rect = progressBar?.getBoundingClientRect();
                        if (rect) {
                            const percent = 0.5;
                            const newTime = percent * duration;
                            if (audio) {
                                audio.currentTime = newTime;
                                currentTime = newTime;
                            }
                        }
                    }
                }}
                role="slider"
                tabindex="0"
                aria-label="播放进度"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={duration > 0 ? (currentTime / duration * 100) : 0}>
                <div class="h-full bg-[var(--primary)] rounded-full transition-all duration-100"
                    style="width: {duration > 0 ? (currentTime / duration) * 100 : 0}%">
                </div>
            </div>
        </div>
        <div class="controls flex items-center justify-center gap-2 mb-4">
            <!-- 随机按钮高亮 -->
            <button class="w-10 h-10 rounded-lg"
                    class:btn-regular={isShuffled}
                    class:btn-plain={!isShuffled}
                    onclick={toggleShuffle}
                    disabled={playlist.length <= 1}>
                <Icon icon="material-symbols:shuffle" class="text-lg" />
            </button>
            <button class="btn-plain w-10 h-10 rounded-lg" onclick={previousSong}
                    disabled={playlist.length <= 1}>
                <Icon icon="material-symbols:skip-previous" class="text-xl" />
            </button>
            <button class="btn-regular w-12 h-12 rounded-full"
                    class:opacity-50={isLoading}
                    disabled={isLoading}
                    onclick={togglePlay}>
                {#if isLoading}
                    <Icon icon="eos-icons:loading" class="text-xl" />
                {:else if isPlaying}
                    <Icon icon="material-symbols:pause" class="text-xl" />
                {:else}
                    <Icon icon="material-symbols:play-arrow" class="text-xl" />
                {/if}
            </button>
            <button class="btn-plain w-10 h-10 rounded-lg" onclick={nextSong}
                    disabled={playlist.length <= 1}>
                <Icon icon="material-symbols:skip-next" class="text-xl" />
            </button>
            <!-- 循环按钮高亮 -->
            <button class="w-10 h-10 rounded-lg"
                    class:btn-regular={isRepeating > 0}
                    class:btn-plain={isRepeating === 0}
                    onclick={toggleRepeat}>
                {#if isRepeating === 1}
                    <Icon icon="material-symbols:repeat-one" class="text-lg" />
                {:else if isRepeating === 2}
                    <Icon icon="material-symbols:repeat" class="text-lg" />
                {:else}
                    <Icon icon="material-symbols:repeat" class="text-lg opacity-50" />
                {/if}
            </button>
        </div>
        <div class="bottom-controls flex items-center gap-2">
            <button class="btn-plain w-8 h-8 rounded-lg" onclick={toggleMute}>
                {#if isMuted || volume === 0}
                    <Icon icon="material-symbols:volume-off" class="text-lg" />
                {:else if volume < 0.5}
                    <Icon icon="material-symbols:volume-down" class="text-lg" />
                {:else}
                    <Icon icon="material-symbols:volume-up" class="text-lg" />
                {/if}
            </button>
            <div class="flex-1 h-2 bg-[var(--btn-regular-bg)] rounded-full cursor-pointer"
                bind:this={volumeBar}
                onmousedown={startVolumeDrag}
                onkeydown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (e.key === 'Enter') toggleMute();
                    }
                }}
                role="slider"
                tabindex="0"
                aria-label="音量控制"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={volume * 100}>
                <div class="h-full bg-[var(--primary)] rounded-full transition-all"
                    class:duration-100={!isVolumeDragging}
                    class:duration-0={isVolumeDragging}
                    style="width: {volume * 100}%">
                </div>
            </div>
            <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"
                    onclick={toggleCollapse}
                    title="折叠播放器">
                <Icon icon="material-symbols:expand-more" class="text-lg" />
            </button>
        </div>
    </div>
    {#if showPlaylist}
        <div class="playlist-panel float-panel fixed bottom-20 right-4 w-80 max-h-96 overflow-hidden z-50"
             transition:slide={{ duration: 300, axis: 'y' }}>
            <div class="playlist-header flex items-center justify-between p-4 border-b border-[var(--line-divider)]">
                <h3 class="text-lg font-semibold text-90">{i18n(Key.playlist)}</h3>
                <button class="btn-plain w-8 h-8 rounded-lg" onclick={togglePlaylist}>
                    <Icon icon="material-symbols:close" class="text-lg" />
                </button>
            </div>
            <div class="playlist-content overflow-y-auto max-h-80">
                {#each playlist as song, index}
                    <div class="playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors"
                         class:bg-[var(--btn-plain-bg)]={index === currentIndex}
                         class:text-[var(--primary)]={index === currentIndex}
                         onclick={() => playSong(index)}
                         onkeydown={(e) => {
                             if (e.key === 'Enter' || e.key === ' ') {
                                 e.preventDefault();
                                 playSong(index);
                             }
                         }}
                         role="button"
                         tabindex="0"
                         aria-label="播放 {song.title} - {song.artist}">
                        <div class="w-6 h-6 flex items-center justify-center">
                            {#if index === currentIndex && isPlaying}
                                <Icon icon="material-symbols:graphic-eq" class="text-[var(--primary)] animate-pulse" />
                            {:else if index === currentIndex}
                                <Icon icon="material-symbols:pause" class="text-[var(--primary)]" />
                            {:else}
                                <span class="text-sm text-[var(--content-meta)]">{index + 1}</span>
                            {/if}
                        </div>
                        <!-- 歌单列表内封面仍为圆角矩形 -->
                        <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0">
                            <img src={getAssetPath(song.cover)} alt={song.title} class="w-full h-full object-cover" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="font-medium truncate" class:text-[var(--primary)]={index === currentIndex} class:text-90={index !== currentIndex}>
                                {song.title}
                            </div>
                            <div class="text-sm text-[var(--content-meta)] truncate" class:text-[var(--primary)]={index === currentIndex}>
                                {song.artist}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

{/if}