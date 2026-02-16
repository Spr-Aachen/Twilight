/// <reference types="mdast" />
import { h } from "hastscript";

/**
 * Render a song card from markdown directives.
 *
 * Usage:
 * :::song{title="Song" artist="Artist" cover="https://..." audio="https://..."}
 * [00:00.00] Lyric line 1
 * [00:12.30] Lyric line 2
 * ::::
 */
export function SongCardComponent(properties, children) {
    const title = properties?.title || "Music";
    const artist = properties?.artist || "Artist";
    const cover = properties?.cover;
    const audio = properties?.audio;
    const cardId = `song-${Math.random().toString(36).slice(2, 10)}`;

    const extractNodeText = (node) => {
        if (!node) return "";
        if (typeof node.value === "string") return node.value;
        // Handle MDAST break and HAST br
        if (node.type === 'break' || node.tagName === 'br') return "\n";
        if (Array.isArray(node.children)) {
            return node.children.map(extractNodeText).join("");
        }
        return "";
    };

    const rawLyrics = (Array.isArray(children) ? children : [])
        .map(extractNodeText)
        .join("\n")
        .trim();

    const parseLrc = (lrc) => {
        if (!lrc) return [];
        // Regex to match [mm:ss.xx] or [mm:ss.xxx]
        // Supports multiple timestamps per line: [00:00.00][00:01.00]Text
        const timeRegex = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/g;
        const output = [];

        const lines = lrc.split(/\r?\n/);
        for (const line of lines) {
            const matches = [...line.matchAll(timeRegex)];
            if (matches.length === 0) continue;

            const text = line.replace(timeRegex, "").trim();

            for (const match of matches) {
                const min = parseInt(match[1], 10);
                const sec = parseInt(match[2], 10);
                const msStr = match[3] || "0";
                // If 2 digits, it's 10ms units (x * 10). If 3 digits, it's 1ms units.
                // Standard LRC .xx is usually 1/100s.
                const ms = msStr.length === 3 ? parseInt(msStr, 10) / 1000 : parseInt(msStr, 10) / 100;

                const time = min * 60 + sec + ms;
                if (!Number.isFinite(time)) continue;

                output.push({ time, text });
            }
        }

        // Sort by time
        return output.sort((a, b) => a.time - b.time);
    };

    const lrcLines = parseLrc(rawLyrics);
    const safeCover = String(cover).replace(/\\/g, "\\\\").replace(/"/g, '\\"');

    const firstLine = lrcLines[0]?.text || "No lyrics provided.";

    const lyricsSource =
        lrcLines.length > 0
            ? h(
                "ul",
                { class: "song-card__lyrics-source", hidden: true, "data-lrc-source": "true" },
                lrcLines.map((line) =>
                    h(
                        "li",
                        {
                            "data-lrc-time": line.time.toFixed(3),
                        },
                        line.text,
                    ),
                ),
            )
            : null;

    return h("section", {
        class: "song-card not-prose",
        "data-song-card": "true",
        "data-song-card-id": cardId,
        "data-song-title": title,
        "data-song-artist": artist,
        style: `--song-cover: url("${safeCover}");`,
    }, [
        h("div", { class: "song-card__bg", "aria-hidden": "true" }),
        h("div", { class: "song-card__overlay", "aria-hidden": "true" }),
        h("div", { class: "song-card__cover-wrap" }, [
            h("img", {
                class: "song-card__cover",
                src: cover,
                alt: `${title} cover`,
                loading: "lazy",
            }),
        ]),
        h("div", { class: "song-card__body" }, [
            h("div", { class: "song-card__meta-row" }, [
                h("h4", { class: "song-card__titleline" }, `${title} - ${artist}`),
            ]),
            h("div", { class: "song-card__lyrics-live", "data-lyrics-live": "true" }, [
                h("p", { class: "song-card__lyrics-exit", "data-lyrics-exit": "true", "aria-hidden": "true" }, ""),
                h("p", { class: "song-card__lyrics-current", "data-lyrics-current": "true" }, firstLine),
            ]),
            h("audio", { class: "song-card__audio-el", preload: "none", "data-song-audio": "true" }, [
                h("source", { "data-src": audio, type: "audio/mpeg" }),
                "Your browser does not support the audio element.",
            ]),
            h("div", { class: "song-card__player", "data-player": "true" }, [
                h(
                    "button",
                    {
                        type: "button",
                        class: "song-card__play-btn",
                        "data-player-toggle": "true",
                        "aria-label": "Play",
                    },
                    [
                        h("span", { class: "song-card__play-icon song-card__play-icon--play", "aria-hidden": "true" }, [
                            h(
                                "svg",
                                {
                                    viewBox: "0 0 24 24",
                                    width: "18",
                                    height: "18",
                                    fill: "currentColor",
                                    "aria-hidden": "true",
                                },
                                [h("path", { d: "M9 6.75c0-.4.44-.64.77-.42l7.5 4.75a.5.5 0 0 1 0 .84l-7.5 4.75A.5.5 0 0 1 9 16.25z" })],
                            ),
                        ]),
                        h("span", { class: "song-card__play-icon song-card__play-icon--pause", "aria-hidden": "true" }, [
                            h(
                                "svg",
                                {
                                    viewBox: "0 0 24 24",
                                    width: "18",
                                    height: "18",
                                    fill: "currentColor",
                                    "aria-hidden": "true",
                                },
                                [
                                    h("rect", { x: "7.3", y: "6", width: "3.2", height: "12", rx: "0.9" }),
                                    h("rect", { x: "13.5", y: "6", width: "3.2", height: "12", rx: "0.9" }),
                                ],
                            ),
                        ]),
                    ],
                ),
                h("span", { class: "song-card__time", "data-player-current": "true" }, "0:00"),
                h("span", { class: "song-card__time-sep" }, "/"),
                h("span", { class: "song-card__time", "data-player-duration": "true" }, "--:--"),
                h("input", {
                    type: "range",
                    min: "0",
                    max: "100",
                    value: "0",
                    step: "0.1",
                    class: "song-card__progress",
                    "data-player-progress": "true",
                    "aria-label": "Playback progress",
                }),
            ]),
            lyricsSource,
        ]),
        h(
            "script",
            { type: "text/javascript" },
            `
(() => {
    const SCRIPT_VERSION = "song-card-v5";

    const initSongCards = () => {
        const cards = document.querySelectorAll('[data-song-card="true"]');
        cards.forEach((card) => {
            if (card.dataset.songBoundVersion === SCRIPT_VERSION) return;
            card.dataset.songBoundVersion = SCRIPT_VERSION;

            const audio = card.querySelector('[data-song-audio="true"]');
            const toggle = card.querySelector('[data-player-toggle="true"]');
            const progress = card.querySelector('[data-player-progress="true"]');
            const currentTimeEl = card.querySelector('[data-player-current="true"]');
            const durationEl = card.querySelector('[data-player-duration="true"]');
            const currentLyricEl = card.querySelector('[data-lyrics-current="true"]');
            const exitLyricEl = card.querySelector('[data-lyrics-exit="true"]');
            const lines = Array.from(card.querySelectorAll('[data-lrc-source="true"] [data-lrc-time]'));
            const coverImg = card.querySelector('.song-card__cover');

            if (!audio || !toggle || !progress || !currentTimeEl || !durationEl) return;

            let audioLoaded = false;
            let currentIndex = -1;

            const ensureAudioLoaded = () => {
                if (audioLoaded) return;
                const sourceEl = audio.querySelector("source[data-src]");
                if (sourceEl && !sourceEl.getAttribute("src")) {
                    const src = sourceEl.getAttribute("data-src");
                    if (src) sourceEl.setAttribute("src", src);
                }
                audio.preload = "metadata";
                audio.load();
                audioLoaded = true;
            };

            const formatTime = (value) => {
                if (!Number.isFinite(value) || value < 0) return "0:00";
                const minute = Math.floor(value / 60);
                const second = Math.floor(value % 60);
                return minute + ":" + String(second).padStart(2, "0");
            };

            const findLineIndex = (time) => {
                // Find the last line where line.time <= time
                let l = 0, r = lines.length - 1;
                let idx = -1;
                while (l <= r) {
                        const mid = Math.floor((l + r) / 2);
                        const t = Number(lines[mid].dataset.lrcTime || 0);
                        if (t <= time) {
                                idx = mid;
                                l = mid + 1;
                        } else {
                                r = mid - 1;
                        }
                }
                return idx;
            };

            const renderLyric = (index) => {
                if (!currentLyricEl || lines.length === 0) return;

                // Don't re-render if index hasn't changed
                if (currentIndex === index) return;
                currentIndex = index;

                const currentLine = index >= 0 ? lines[index] : null;
                const nextText = currentLine ? (currentLine.textContent || "") : (lines[0]?.textContent || "...");

                // If text is same, just skip animation but ensure text is set
                if (currentLyricEl.textContent === nextText) return;

                const prevText = currentLyricEl.textContent || "";

                // Exit animation
                if (exitLyricEl && prevText) {
                        exitLyricEl.textContent = prevText;
                        exitLyricEl.classList.remove("is-leaving");
                        void exitLyricEl.offsetWidth; // Trigger reflow
                        exitLyricEl.classList.add("is-leaving");
                }

                // Enter animation
                currentLyricEl.textContent = nextText;
                currentLyricEl.classList.remove("is-entering");
                void currentLyricEl.offsetWidth; // Trigger reflow
                currentLyricEl.classList.add("is-entering");
            };

            const updateProgress = () => {
                const duration = audio.duration || 0;
                const current = audio.currentTime || 0;
                const percent = duration > 0 ? (current / duration) * 100 : 0;

                // Only update if not dragging (optional, but good UX)
                // Here we just update always
                progress.value = String(percent);
                progress.style.setProperty("--song-progress", percent.toFixed(3) + "%");
                currentTimeEl.textContent = formatTime(current);
                durationEl.textContent = duration > 0 ? formatTime(duration) : "--:--";
            };

            const updateToggle = () => {
                const playing = !audio.paused;
                toggle.classList.toggle("is-playing", playing);
                toggle.setAttribute("aria-label", playing ? "Pause" : "Play");
            };

            const syncByTime = () => {
                const time = audio.currentTime || 0;
                const idx = findLineIndex(time);
                renderLyric(idx);
                updateProgress();
            };

            toggle.addEventListener("click", () => {
                if (audio.paused) {
                    ensureAudioLoaded();
                    audio.play().catch(() => {});
                } else {
                    audio.pause();
                }
            });

            progress.addEventListener("input", () => {
                const duration = audio.duration || 0;
                if (!duration) return;
                const percent = Number(progress.value || 0) / 100;
                audio.currentTime = duration * percent;
                syncByTime();
            });

            audio.addEventListener("loadedmetadata", () => {
                updateProgress();
                syncByTime();
            });

            audio.addEventListener('timeupdate', syncByTime);
            audio.addEventListener('play', updateToggle);
            audio.addEventListener('pause', updateToggle);
            audio.addEventListener('ended', updateToggle);

            // Color extraction logic (simplified)
            const applyAccentFromCover = () => {
                if (!coverImg || !coverImg.complete || coverImg.naturalWidth <= 0) return;
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = 24; canvas.height = 24;
                    const ctx = canvas.getContext("2d", { willReadFrequently: true });
                    if (!ctx) return;
                    ctx.drawImage(coverImg, 0, 0, 24, 24);
                    const data = ctx.getImageData(0, 0, 24, 24).data;
                    let r = 0, g = 0, b = 0, count = 0;
                    for (let i = 0; i < data.length; i += 4) {
                         if (data[i + 3] < 140) continue;
                         r += data[i]; g += data[i + 1]; b += data[i + 2];
                         count++;
                    }
                    if (!count) return;
                    r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);

                    const max = Math.max(r, g, b), min = Math.min(r, g, b);
                    const l = (max + min) / 510;
                    let h = 0, s = 0;
                    if (max !== min) {
                         const d = max - min;
                         s = l > 0.5 ? d / (510 - max - min) : d / (max + min);
                         switch (max) {
                                 case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                                 case g: h = (b - r) / d + 2; break;
                                 default: h = (r - g) / d + 4;
                         }
                         h /= 6;
                    }
                    const hue = Math.round(h * 360);
                    const sat = Math.min(78, Math.max(45, Math.round(s * 100)));
                    const light = Math.min(54, Math.max(36, Math.round(l * 100)));

                    card.style.setProperty("--song-accent", \`hsl(\${hue} \${sat}% \${light}%)\`);
                    card.style.setProperty("--song-accent-soft", \`hsl(\${hue} \${Math.max(38, sat - 16)}% \${Math.min(68, light + 16)}% / 0.2)\`);
                } catch (_) {}
            };

            if (coverImg.complete) applyAccentFromCover();
            else coverImg.addEventListener("load", applyAccentFromCover, { once: true });

            updateToggle();
            updateProgress();
        });
    };

    window.__songCardInit = initSongCards;
    initSongCards();
    if (!window.__songCardListenersBound) {
        document.addEventListener('astro:page-load', () => window.__songCardInit?.());
        document.addEventListener('swup:contentReplaced', () => window.__songCardInit?.());
        window.__songCardListenersBound = true;
    }
})();
            `,
        ),
    ]);
}
