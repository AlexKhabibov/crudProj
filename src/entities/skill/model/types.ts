interface SkillSpecialization {
    id: number;
    title: string;
    slug: string;
    description: string;
    imageSrc: string | null;
    createdAt: string;
    updatedAt: string;
}

interface SkillCreatedBy {
    id: string;
    username: string;
}

export interface Skill {
    id: number;
    title: string;
    description: string;
    imageSrc: string;
    createdAt: string;
    updatedAt: string;
    specializations: SkillSpecialization[];
    createdBy: SkillCreatedBy | null;
}

export interface SkillDetails extends Skill {
    canDelete: boolean;
}

export interface SkillsListResponse {
    total: number;
    page: number;
    limit: number;
    data: Skill[];
}