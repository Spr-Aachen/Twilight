import typography from '@tailwindcss/typography';

import {
    BREAKPOINT_SM,
    BREAKPOINT_MD,
    BREAKPOINT_LG,
    BREAKPOINT_XL,
} from './src/constants/breakpoints';


/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
    darkMode: "class", // allows toggling dark mode manually
    theme: {
        extend: {
            screens: {
                'sm': `${BREAKPOINT_SM}px`,
                'md': `${BREAKPOINT_MD}px`,
                'lg': `${BREAKPOINT_LG}px`,
                'xl': `${BREAKPOINT_XL}px`,
            }, // Custom screen sizes
            transitionDuration: {
                '300': '300ms',
                '600': '600ms',
            }, // Custom transition duration
        },
    },
    plugins: [typography],
}