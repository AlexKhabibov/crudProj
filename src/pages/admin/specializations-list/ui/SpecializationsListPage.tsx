import { useGetSkillsListQuery } from "@/entities/skill";
import { useGetSpecializationsListQuery } from "@/entities/specialization";
import { SpecializationsTable } from "@/widgets/specialization-table";

export function SpecializationsListPage() {
    const {
        data: specializationsData,
        isLoading: specializationsLoading,
        error: specializationsError,
    } = useGetSpecializationsListQuery({
        page: 1,
        limit: 10,
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

            <SpecializationsTable
                specializations={specializationsData?.data ?? []}
                skills={skillsData?.data ?? []}
            />
        </>
    );
}