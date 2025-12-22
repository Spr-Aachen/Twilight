// Skill data configuration file
// Used to manage data for the skill display page
const skillModules = import.meta.glob('./skills/*.json', { eager: true });

export interface Skill {
    id: string;
    name: string;
    description: string;
    icon: string; // Iconify icon name
    category: "ai" | "backend" | "client" | "frontend" | "database" | "engines" | "tools" | "others";
    level: "beginner" | "intermediate" | "advanced" | "expert";
    experience: {
        years: number;
        months: number;
    };
    projects?: string[]; // Related project IDs
    certifications?: string[];
    color?: string; // Skill card theme color
}

export const skillsData: Skill[] = Object.entries(skillModules).map(([path, mod]: [string, any]) => {
  const id = path.split('/').pop()?.replace('.json', '') || '';
  const data = mod.default;
  return { id, ...data } as Skill;
});

// Get skill statistics
export const getSkillStats = () => {
    const total = skillsData.length;
    const byLevel = {
        beginner: skillsData.filter((s) => s.level === "beginner").length,
        intermediate: skillsData.filter((s) => s.level === "intermediate").length,
        advanced: skillsData.filter((s) => s.level === "advanced").length,
        expert: skillsData.filter((s) => s.level === "expert").length,
    };
    const byCategory = {
        ai: skillsData.filter((s) => s.category === "ai").length,
        backend: skillsData.filter((s) => s.category === "backend").length,
        client: skillsData.filter((s) => s.category === "client").length,
        frontend: skillsData.filter((s) => s.category === "frontend").length,
        database: skillsData.filter((s) => s.category === "database").length,
        tools: skillsData.filter((s) => s.category === "tools").length,
        engines: skillsData.filter((s) => s.category === "engines").length,
        others: skillsData.filter((s) => s.category === "others").length,
    };
    return { total, byLevel, byCategory };
};


// Get skills by category
export const getSkillsByCategory = (category?: string) => {
    if (!category || category === "all") {
        return skillsData;
    }
    return skillsData.filter((s) => s.category === category);
};


// Get advanced skills
export const getAdvancedSkills = () => {
    return skillsData.filter(
        (s) => s.level === "advanced" || s.level === "expert",
    );
};


// Calculate total years of experience
export const getTotalExperience = () => {
    const totalMonths = skillsData.reduce((total, skill) => {
        return total + skill.experience.years * 12 + skill.experience.months;
    }, 0);
    return {
        years: Math.floor(totalMonths / 12),
        months: totalMonths % 12,
    };
};