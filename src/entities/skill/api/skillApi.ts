import { baseApi } from "@/shared/api";
import type {
    SkillDetails,
    SkillsListResponse,
} from "../model/types";

export interface GetSkillsParams {
    page?: number;
    limit?: number;
    specializations?: string;
    authorId?: string;
    title?: string;
}

export const skillApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSkillsList: builder.query<
            SkillsListResponse,
            GetSkillsParams
        >({
            query: (params) => ({
                url: "/skills",
                params,
            }),
        }),

        getSkillById: builder.query<SkillDetails, number>({
            query: (id) => `/skills/${id}`,
        }),
    }),
});

export const {
    useGetSkillsListQuery,
    useGetSkillByIdQuery,
} = skillApi;