import { siteConfig } from "@/config";


// Function to set hue
export function setHue(hue: number): void {
    if (typeof localStorage !== "undefined") {
        localStorage.setItem("hue", String(hue));
    }
    if (typeof document !== "undefined") {
        const r = document.querySelector(":root") as HTMLElement;
        if (!r) {
            return;
        }
        r.style.setProperty("--hue", String(hue));
    }
}

// Function to get default hue from config-carrier dataset
export function getDefaultHue(): number {
    const fallback = siteConfig.themeColor.hue.toString();
    if (typeof document !== "undefined") {
        const configCarrier = document.getElementById("config-carrier");
        return Number.parseInt(configCarrier?.dataset.hue || fallback);
    }
    return Number.parseInt(fallback);
}

// Function to get hue from local storage or default
export function getHue(): number {
    if (typeof localStorage !== "undefined") {
        const stored = localStorage.getItem("hue");
        return stored ? Number.parseInt(stored) : getDefaultHue();
    }
    return getDefaultHue();
}

// Function to initialize hue from local storage or default
export function initHue(): void {
    const hue = getHue();
    setHue(hue);
}