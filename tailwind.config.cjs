/** @type {import('tailwindcss').Config} */


module.exports = {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue,mjs}"],
    darkMode: "class", // allows toggling dark mode manually
    theme: {
        extend: {
            transitionDuration: {
                '300': '300ms',
                '600': '600ms',
            }, // Custom transition duration
        },
    },
    plugins: [require("@tailwindcss/typography")],
}