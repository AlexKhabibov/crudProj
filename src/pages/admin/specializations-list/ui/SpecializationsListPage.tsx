import { useState } from "react";
import type { RowSelectionState } from "@tanstack/react-table";
import { useGetSkillsListQuery } from "@/entities/skill";
import {
    useDeleteSpecializationByIdMutation,
    useGetSpecializationsListQuery,
} from "@/entities/specialization";
import { SearchSpecializations } from "@/features/search-specialization";
import { Pagination } from "@/shared/ui";
import { SpecializationsTable } from "@/widgets/specialization-table";

export function SpecializationsListPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [rowSelection, setRowSelection] =
        useState<RowSelectionState>({});

    const limit = 10;

    const {
        data: specializationsData,
        isLoading: specializationsLoading,
        error: specializationsError,
        refetch: refetchSpecializations,
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

    const [deleteSpecialization, { isLoading: isDeleting }] =
        useDeleteSpecializationByIdMutation();

    const selectedIds = Object.keys(rowSelection).map(Number);

    const handleDelete = async () => {
        if (selectedIds.length === 0) {
            return;
        }

        await Promise.all(
            selectedIds.map((id) =>
                deleteSpecialization(id).unwrap()
            )
        );

        setRowSelection({});

        const result = await refetchSpecializations();

        const totalItems = result.data?.total ?? 0;
        const totalPages = Math.max(
            1,
            Math.ceil(totalItems / limit)
        );

        if (page > totalPages) {
            setPage(totalPages);
        }
    };

    if (specializationsLoading || skillsLoading) {
        return <p>Загрузка...</p>;
    }

    if (specializationsError || skillsError) {
        return <p>Ошибка загрузки</p>;
    }

    return (
        <>
            <h1>Список специализаций</h1>

            <div>
                <SearchSpecializations
                    onSearch={(value) => {
                        setSearch(value);
                        setPage(1);
                        setRowSelection({});
                    }}
                />

                <div>
                    <button
                        type="button"
                        disabled={
                            selectedIds.length === 0 ||
                            isDeleting
                        }
                        onClick={handleDelete}
                    >
                        {isDeleting ? "Удаление..." : "Удалить"}
                    </button>

                    <button type="button">
                        Добавить
                    </button>
                </div>
            </div>

            <SpecializationsTable
                specializations={
                    specializationsData?.data ?? []
                }
                skills={skillsData?.data ?? []}
                rowSelection={rowSelection}
                onRowSelectionChange={setRowSelection}
            />

            <Pagination
                currentPage={page}
                totalItems={specializationsData?.total ?? 0}
                itemsPerPage={limit}
                onPageChange={(newPage) => {
                    setPage(newPage);
                    setRowSelection({});
                }}
            />
        </>
    );
}