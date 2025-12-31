// Function to set hue
export function setHue(hue: number): void {
    localStorage.setItem("hue", String(hue));
    const r = document.querySelector(":root") as HTMLElement;
    if (!r) {
        return;
    }
    r.style.setProperty("--hue", String(hue));
}

// Function to get default hue from config-carrier dataset
export function getDefaultHue(): number {
    const fallback = "250";
    const configCarrier = document.getElementById("config-carrier");
    return Number.parseInt(configCarrier?.dataset.hue || fallback);
}

// Function to get hue from local storage or default
export function getHue(): number {
    const stored = localStorage.getItem("hue");
    return stored ? Number.parseInt(stored) : getDefaultHue();
}

// Function to initialize hue from local storage or default
export function initHue(): void {
    const hue = getHue();
    setHue(hue);
}