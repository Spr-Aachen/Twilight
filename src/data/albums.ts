// Album data configuration file
// Used to manage data for the album display page
const albumModules = import.meta.glob('./albums/*.json', { eager: true });

export interface Photo {
    src: string;
    alt?: string;
    title?: string;
    description?: string;
    tags?: string[];
    date?: string;
    width?: number;
    height?: number;
}

export interface AlbumGroup {
    id: string;
    title: string;
    description?: string;
    cover: string;
    date: string;
    location?: string;
    tags?: string[];
    layout?: "grid" | "masonry" | "list";
    columns?: number;
    photos: Photo[];
    visible?: boolean;
}

export const albums: AlbumGroup[] = Object.entries(albumModules).map(([path, mod]: [string, any]) => {
    const id = path.split('/').pop()?.replace('.json', '') || '';
    const data = mod.default as any;
    const album: AlbumGroup = {
        id,
        ...data,
        photos: data.photos || [],
        visible: data.visible !== false, // 默认为 true
    };
    return album;
});

// Sort albums by date in descending order
export const sortedAlbums = [...albums].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);