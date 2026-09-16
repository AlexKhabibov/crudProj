import { baseApi } from "@/shared/api";
import type {
    GetSpecializationsParams,
    Specialization,
    SpecializationDetails,
} from "../model/types";

interface SpecializationsListResponse {
    total: number;
    page: number;
    limit: number;
    data: Specialization[];
}

interface SpecializationRequest {
    title: string;
    description: string;
    imageSrc: string;
    specializationImage: string;
}

interface SpecializationResponse {
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
    };
}

interface CreateSpecializationResponse extends SpecializationResponse {
    createdById: string;
}

interface UpdateSpecializationRequest {
    id: number;
    body: SpecializationRequest;
}

interface DeleteSpecializationResponse {
    affected: number;
    raw: unknown[];
}

export const specializationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSpecializationsList: builder.query<
            SpecializationsListResponse,
            GetSpecializationsParams
        >({
            query: (params) => ({
                url: "/specializations",
                params,
            }),
        }),

        getSpecializationById: builder.query<
            SpecializationDetails,
            number
        >({
            query: (id) => `/specializations/${id}`,
        }),

        createSpecialization: builder.mutation<
            CreateSpecializationResponse,
            SpecializationRequest
        >({
            query: (body) => ({
                url: "/specializations",
                method: "POST",
                body,
            }),
        }),

        updateSpecializationById: builder.mutation<
            SpecializationResponse,
            UpdateSpecializationRequest
        >({
            query: ({ id, body }) => ({
                url: `/specializations/${id}`,
                method: "PATCH",
                body,
            }),
        }),

        deleteSpecializationById: builder.mutation<
            DeleteSpecializationResponse,
            number
        >({
            query: (id) => ({
                url: `/specializations/${id}`,
                method: "DELETE",
            }),
        }),

        // getAllSpecializations: builder.query<Specialization[], void>({
        //     async queryFn(_arg, _queryApi, _extraOptions, baseQuery) {
        //         const firstPage = await baseQuery({
        //             url: "/specializations",
        //             params: {
        //                 page: 1,
        //                 limit: 10,
        //             },
        //         });

        //         if (firstPage.error) {
        //             return { error: firstPage.error };
        //         }

        //         const firstResponse =
        //             firstPage.data as SpecializationsListResponse;

        //         const allSpecializations = [...firstResponse.data];

        //         const totalPages = Math.ceil(
        //             firstResponse.total / firstResponse.limit
        //         );

        //         for (let page = 2; page <= totalPages; page++) {
        //             const response = await baseQuery({
        //                 url: "/specializations",
        //                 params: {
        //                     page,
        //                     limit: firstResponse.limit,
        //                 },
        //             });

        //             if (response.error) {
        //                 return { error: response.error };
        //             }

        //             const pageResponse =
        //                 response.data as SpecializationsListResponse;

        //             allSpecializations.push(...pageResponse.data);
        //         }

        //         return {
        //             data: allSpecializations,
        //         };
        //     },
        // }),
    }),
});

export const {
    useGetSpecializationByIdQuery,
    useGetSpecializationsListQuery,
    useCreateSpecializationMutation,
    useUpdateSpecializationByIdMutation,
    useDeleteSpecializationByIdMutation,
} = specializationApi;