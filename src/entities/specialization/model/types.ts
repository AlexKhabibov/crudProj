export interface Specialization {
    id: number;
    title: string;
    slug: string;
    description: string;
    imageSrc: string;
    createdAt: string;
    updatedAt: string;
    createdBy: {
        id: string;
        username: string;
    } | null;
}

export interface SpecializationDetails extends Specialization {
    canDelete: boolean;
}

export interface SpecializationFormData {
    title: string;
    description: string;
    imageSrc: string;
    specializationImage: string;
}

export interface GetSpecializationsParams {
    page?: number;
    limit?: number;
    title?: string;
    authorId?: string;
}