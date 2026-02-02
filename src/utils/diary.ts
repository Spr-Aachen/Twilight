// Diary data configuration file
// Used to manage data for the diary display page
const diaryModules = import.meta.glob('../content/diary/**/*.json', { eager: true });

export interface Moment {
    id: string;
    title?: string;
    content: string;
    date: string;
    images?: string[];
    basePath?: string;
}

export const moments: Moment[] = Object.entries(diaryModules).map(([path, mod]: [string, any]) => {
    const id = path.split('/').pop()?.replace('.json', '') || '';
    const data = mod.default as any;
    // Get directory path relative to src/
    const basePath = path.replace('../', '').replace(/\/[^/]+$/, '');

    const moment: Moment = {
        id,
        ...data,
        basePath,
    };
    return moment;
});

// Sort moments by date in descending order
export const sortedMoments = [...moments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);