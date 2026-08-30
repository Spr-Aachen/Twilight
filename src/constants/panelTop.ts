import {
    NAVBAR_HEIGHT,
    NAVBAR_GAP,
    NAVBAR_FOLLOW_DISTANCE,
    BANNER_HEIGHT_EXTEND,
} from "@constants/layout";

/**
 * Main panel top offset (--main-content-top) formulas
 * Used by src/layouts/base.astro to define the CSS variable per page mode
 */

// Non-banner mode: navbar + gap + follow distance
export const MAIN_PANEL_TOP_DEFAULT =
    "calc(var(--navbar-height) + var(--navbar-gap) + var(--navbar-follow-distance))";

// Banner mode: banner bottom, overlapped by the main panel
export const MAIN_PANEL_TOP_BANNER =
    "calc(var(--banner-height) - var(--main-panel-overlaps-banner-height))";

// Home page with banner: same as banner mode plus the extended banner height
export const MAIN_PANEL_TOP_BANNER_HOME = `calc(var(--banner-height) - var(--main-panel-overlaps-banner-height) + var(--banner-height-extend, ${BANNER_HEIGHT_EXTEND}vh))`;

// JS-side numeric value (px) for non-banner mode, e.g. scroll offset calculations
export const MAIN_PANEL_TOP_PX =
    NAVBAR_HEIGHT + NAVBAR_GAP * 16 + NAVBAR_FOLLOW_DISTANCE * 16;