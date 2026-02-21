/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Creates a Music Card component.
 *
 * @param {Object} properties - The properties of the component.
 * @param {string} properties.title - The title of the music.
 * @param {string} properties.artist - The artist of the music.
 * @param {string} properties.audio - The audio source URL.
 * @param {string} properties.cover - The cover image URL.
 * @param {string} properties.lrc - The lyrics URL.
 * @param {string} properties.meting - The Meting API URL (optional).
 * @param {import('mdast').RootContent[]} children - The children elements (lyrics text).
 * @returns {import('mdast').Parent} The created Music Card component.
 */
export function MusicCardComponent(properties, children) {
    // Helper to resolve paths
    const resolvePath = (path) => {
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://")) return path;
        if (path.startsWith("/")) return path;
        return "/" + path;
    };

    const title = properties.title || (properties.meting ? "Loading..." : "Unknown Title");
    const artist = properties.artist || (properties.meting ? "Loading..." : "Unknown Artist");
    const audioSrc = resolvePath(properties.audio);
    const coverSrc = resolvePath(properties.cover);
    const lrcSrc = resolvePath(properties.lrc);
    const metingUrl = properties.meting || "";

    // Extract inline lyrics if present in children
    const extractNodeText = (node) => {
        if (!node) return "";
        if (typeof node.value === "string") return node.value;
        if (Array.isArray(node.children)) {
            return node.children.map(extractNodeText).join("");
        }
        return "";
    };

    const inlineLyrics = (Array.isArray(children) ? children : [])
        .map(extractNodeText)
        .join("\n")
        .trim();

    const cardUuid = `SC${Math.random().toString(36).slice(-6)}`;

    // Create the HTML structure
    const nCover = h("div", {
        class: "music-cover",
        style: `background-image: url('${coverSrc}');`
    });

    const nTitle = h("div", { class: "music-title" }, title);
    const nArtist = h("div", { class: "music-artist" }, artist);
    const nHeader = h("div", { class: "music-header" }, [nTitle, nArtist]);

    // Use grid layout for overlapping lyrics to support the transition effect
    const nLyric = h("div", { class: "music-lyric", id: `${cardUuid}-lyric`, style: "display: grid; place-items: center;" }, [
        h("div", { class: "lyric-exit", style: "grid-area: 1/1; opacity: 0; pointer-events: none;" }, ""),
        h("div", { class: "lyric-current", style: "grid-area: 1/1;" }, "Loading lyrics...")
    ]);

    const nPlayBtn = h("button", { class: "play-btn", id: `${cardUuid}-play`, "aria-label": "Play/Pause" }, [
        // Play Icon (SVG)
        h("svg", { viewBox: "0 0 24 24", class: "play-icon" }, [
            h("path", { d: "M8 5v14l11-7z" })
        ]),
        // Pause Icon (SVG)
        h("svg", { viewBox: "0 0 24 24", class: "pause-icon", style: "display: none;" }, [
            h("path", { d: "M6 19h4V5H6v14zm8-14v14h4V5h-4z" })
        ])
    ]);

    const nProgressBar = h("div", { class: "progress-bar", id: `${cardUuid}-progress-bar` });
    const nProgressContainer = h("div", { class: "progress-container", id: `${cardUuid}-progress-container` }, [nProgressBar]);

    const nTimeDisplay = h("div", { class: "time-display", id: `${cardUuid}-time` }, "0:00 / 0:00");

    const nControls = h("div", { class: "music-controls" }, [
        nPlayBtn,
        nProgressContainer,
        nTimeDisplay
    ]);

    const nInfo = h("div", { class: "music-info" }, [
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
    (async function() {
        const cardId = '${cardUuid}';
        const audio = document.getElementById(cardId + '-audio');
        const playBtn = document.getElementById(cardId + '-play');
        const playIcon = playBtn.querySelector('.play-icon');
        const pauseIcon = playBtn.querySelector('.pause-icon');
        const progressContainer = document.getElementById(cardId + '-progress-container');
        const progressBar = document.getElementById(cardId + '-progress-bar');
        const timeDisplay = document.getElementById(cardId + '-time');
        const lyricContainer = document.getElementById(cardId + '-lyric');
        const currentLyricEl = lyricContainer.querySelector('.lyric-current');
        const exitLyricEl = lyricContainer.querySelector('.lyric-exit');
        
        let isPlaying = false;
        let lyrics = [];
        let inlineLyrics = ${JSON.stringify(inlineLyrics)};
        let lrcSrc = '${lrcSrc}';
        const metingUrl = '${metingUrl}';

        // Helper: Format Time
        function formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return "0:00";
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return mins + ":" + (secs < 10 ? "0" : "") + secs;
        }

        // Helper: Parse LRC
        const stripTimestampPrefix = (line) => line.replace(/^\\s*\\[[^\\]]+\\]\\s*/g, "").trim();

        const parseTimestamp = (token) => {
            if (!token) return null;
            const normalized = token.trim().replaceAll("：", ":");
            if (!normalized) return null;

            // mm:ss(.xxx)
            if (normalized.includes(":")) {
                const [mRaw, secRaw] = normalized.split(":", 2);
                const minute = Number(mRaw);
                if (!Number.isFinite(minute)) return null;

                let second = 0;
                let fraction = 0;
                if (secRaw.includes(".")) {
                    const [sRaw, fRaw] = secRaw.split(".", 2);
                    second = Number(sRaw);
                    if (!Number.isFinite(second)) return null;
                    const fracStr = (fRaw || "0").replace(/[^\\d]/g, "");
                    fraction = fracStr ? Number(fracStr) / Math.pow(10, fracStr.length) : 0;
                } else {
                    second = Number(secRaw);
                    if (!Number.isFinite(second)) return null;
                }
                return minute * 60 + second + fraction;
            }

            // ss(.xxx)
            if (normalized.includes(".")) {
                const [sRaw, fRaw] = normalized.split(".", 2);
                const second = Number(sRaw);
                if (!Number.isFinite(second)) return null;
                const fracStr = (fRaw || "0").replace(/[^\\d]/g, "");
                const fraction = fracStr ? Number(fracStr) / Math.pow(10, fracStr.length) : 0;
                return second + fraction;
            }

            return null;
        };

        const parseLRC = (input) => {
            if (!input) return [];
            const output = [];
            const lines = input.split(/\\r?\\n/);
            for (const line of lines) {
                const timestampMatches = [...line.matchAll(/\\[([^\\]]+)\\]/g)];
                const text = stripTimestampPrefix(line.replace(/\\[([^\\]]+)\\]/g, "").trim());
                if (timestampMatches.length === 0) continue;
                for (const match of timestampMatches) {
                    const time = parseTimestamp(match[1]);
                    if (time === null || Number.isNaN(time)) continue;
                    output.push({ time, text: text || "..." });
                }
            }
            return output.sort((a, b) => a.time - b.time);
        };

        // Helper: Render Lyric
        // Restored animation logic from commit 2c0378c963bcf6a51c3a404a8c7275e41185e246
        function renderLyric(index) {
            if (!currentLyricEl) return;
            
            if (lyrics.length === 0) {
                 // If no lyrics, maybe show title/artist or just "..."
                 return;
            }
            
            const current = (index >= 0 && index < lyrics.length) ? lyrics[index] : lyrics[0];
            const nextText = current ? (current.text || "...") : "...";
            
            if (currentLyricEl.innerText !== nextText) {
                const prevText = currentLyricEl.innerText || "";
                
                if (prevText && typeof exitLyricEl.animate === "function") {
                    exitLyricEl.innerText = prevText;
                    
                    exitLyricEl.getAnimations().forEach(a => a.cancel());
                    exitLyricEl.animate([
                        { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0px)" },
                        { opacity: 0, transform: "translateY(-12px) scale(0.992)", filter: "blur(2px)" },
                    ], {
                        duration: 460,
                        easing: "cubic-bezier(0.22,1,0.36,1)",
                        fill: "both",
                    });
                } else if (prevText) {
                    // Fallback if animate not supported
                    exitLyricEl.innerText = prevText;
                    exitLyricEl.style.opacity = 0;
                }
                
                currentLyricEl.innerText = nextText;
                
                if (typeof currentLyricEl.animate === "function") {
                    currentLyricEl.getAnimations().forEach(a => a.cancel());
                    currentLyricEl.animate([
                        { opacity: 0, transform: "translateY(12px) scale(0.992)", filter: "blur(2px)" },
                        { opacity: 0.92, transform: "translateY(-1px) scale(1.001)", filter: "blur(0.35px)" },
                        { opacity: 1, transform: "translateY(0) scale(1)", filter: "blur(0px)" },
                    ], {
                        duration: 460,
                        easing: "cubic-bezier(0.64,0,0.78,0)",
                        fill: "both",
                    });
                }
            }
        }

        async function loadLyrics() {
            let lrcText = inlineLyrics;
            if ((!lrcText || lrcText.trim() === "") && lrcSrc) {
                if (lrcSrc.startsWith('http') || lrcSrc.startsWith('/')) {
                    try {
                        const res = await fetch(lrcSrc);
                        if (res.ok) lrcText = await res.text();
                    } catch (e) { console.error('Failed to load lyrics', e); }
                } else {
                    // Treat lrcSrc as the lyric content itself (Meting sometimes returns this)
                    lrcText = lrcSrc;
                }
            }
            
            if (lrcText) {
                lyrics = parseLRC(lrcText);
                renderLyric(0);
            } else {
                currentLyricEl.innerText = "${title} - ${artist}";
            }
        }

        // Meting Logic
        if (metingUrl) {
            try {
                const res = await fetch(metingUrl);
                const data = await res.json();
                const music = Array.isArray(data) ? data[0] : data;
                
                if (music) {
                    const titleEl = document.querySelector('#' + cardId + '-card .music-title');
                    const artistEl = document.querySelector('#' + cardId + '-card .music-artist');
                    const coverEl = document.querySelector('#' + cardId + '-card .music-cover');
                    
                    if (titleEl) titleEl.innerText = music.title;
                    if (artistEl) artistEl.innerText = music.author;
                    if (coverEl) coverEl.style.backgroundImage = 'url("' + music.pic + '")';
                    
                    audio.src = music.url;
                    
                    if (music.lrc) {
                        lrcSrc = music.lrc;
                        inlineLyrics = ""; // Clear inline lyrics to force load from new src
                        await loadLyrics(); // Reload lyrics
                    }
                }
            } catch (e) {
                console.error('Meting fetch error:', e);
                currentLyricEl.innerText = "Error loading music data";
            }
        } else {
            // Load initial lyrics if not using Meting (or Meting url empty)
            loadLyrics();
        }

        function updatePlayState() {
            if (isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                audio.play().catch(e => {
                    console.error("Play error", e);
                    isPlaying = false;
                    updatePlayState();
                });
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                audio.pause();
            }
        }

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isPlaying = !isPlaying;
            updatePlayState();
        });

        audio.addEventListener('timeupdate', () => {
            const current = audio.currentTime;
            const duration = audio.duration || 0;
            const percent = duration > 0 ? (current / duration) * 100 : 0;
            progressBar.style.width = percent + '%';
            timeDisplay.innerText = formatTime(current) + ' / ' + formatTime(duration);

            if (lyrics.length > 0) {
                // Find current lyric line
                let idx = -1;
                for (let i = 0; i < lyrics.length; i++) {
                    if (current >= lyrics[i].time) {
                        idx = i;
                    } else {
                        break;
                    }
                }
                renderLyric(idx);
            }
        });

        audio.addEventListener('ended', () => {
            isPlaying = false;
            updatePlayState();
            progressBar.style.width = '0%';
            timeDisplay.innerText = "0:00 / " + formatTime(audio.duration);
            if (lyrics.length > 0) renderLyric(0);
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
    })();
    `;

    const nScript = h("script", { type: "text/javascript" }, scriptContent);

    return h("div", { class: "card-music", id: `${cardUuid}-card` }, [
        nCover,
        nInfo,
        nAudio,
        nScript
    ]);
}