// Friends links data configuration file
// Used to manage data for the friends page
const friendModules = import.meta.glob('./friends/*.json', { eager: true });

export interface FriendLink {
    id: string;
    title: string;
    imgurl: string;
    desc: string;
    siteurl: string;
    tags?: string[];
}

export const friendsData: FriendLink[] = Object.entries(friendModules).map(([path, mod]: [string, any]) => {
    const id = path.split('/').pop()?.replace('.json', '') || '';
    const data = mod.default;
    return { id, ...data } as FriendLink;
});