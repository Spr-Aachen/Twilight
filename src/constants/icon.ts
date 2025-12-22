import type { Favicon } from "@/types/config.ts";


export const defaultFavicons: Favicon[] = [
    {
        src: "/favicon/icon-light.ico",
        theme: "light",
        sizes: "96x96",
    },
    {
        src: "/favicon/icon-dark.ico",
        theme: "dark",
        sizes: "96x96",
    },
];
