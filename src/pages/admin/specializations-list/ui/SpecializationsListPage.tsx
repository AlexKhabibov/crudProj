import { useState } from "react";
import { useGetSkillsListQuery } from "@/entities/skill";
import { useGetSpecializationsListQuery } from "@/entities/specialization";
import { SearchSpecializations } from "@/features/search-specialization";
import { Pagination } from "@/shared/ui";
import { SpecializationsTable } from "@/widgets/specialization-table";

export function SpecializationsListPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");

    const {
        data: specializationsData,
        isLoading: specializationsLoading,
        error: specializationsError,
    } = useGetSpecializationsListQuery({
        page,
        limit,
        title: search,
    });

    const specializationIds =
        specializationsData?.data.map(
            (specialization) => specialization.id
        ) ?? [];

    const {
        data: skillsData,
        isLoading: skillsLoading,
        error: skillsError,
    } = useGetSkillsListQuery(
        {
            page: 1,
            limit: 10,
            specializations: specializationIds.join(","),
        },
        {
            skip: specializationIds.length === 0,
        }
    );

    if (specializationsLoading || skillsLoading) {
        return <p>Загрузка...</p>;
    }

    if (specializationsError || skillsError) {
        return <p>Ошибка загрузки</p>;
    }

    return (
        <>
            <h1>Список специализаций</h1>

            <SearchSpecializations
                onSearch={(value) => {
                    setSearch(value);
                    setPage(1);
                }}
            />

            <SpecializationsTable
                specializations={specializationsData?.data ?? []}
                skills={skillsData?.data ?? []}
            />

            <Pagination
                currentPage={page}
                totalItems={specializationsData?.total ?? 0}
                itemsPerPage={limit}
                onPageChange={setPage}
            />
        </>
    );
}