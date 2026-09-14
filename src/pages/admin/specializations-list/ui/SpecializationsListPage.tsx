import { useGetSkillsListQuery } from "@/entities/skill";
import { useGetSpecializationsListQuery } from "@/entities/specialization";
import { Link } from "react-router-dom";

export function SpecializationsListPage() {
    const {
        data: specializationsData,
        isLoading: specializationsLoading,
        error: specializationsError,
    } = useGetSpecializationsListQuery({
        page: 1,
        limit: 10,
    });

    const {
        data: skillsData,
        isLoading: skillsLoading,
        error: skillsError,
    } = useGetSkillsListQuery({
        page: 1,
        limit: 10,
    });

    console.log("specializations:", specializationsData);
    console.log("skills:", skillsData);

    if (specializationsLoading || skillsLoading) {
        return <p>Загрузка...</p>;
    }

    if (specializationsError || skillsError) {
        return <p>Ошибка загрузки</p>;
    }

    return (
        <>
            <h1>Список специализаций</h1>

            <ul>
                {specializationsData?.data.map((specialization) => (
                    <li key={specialization.id}>
                        <Link
                            to={`/admin/specializations/${specialization.id}`}
                        >
                            {specialization.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </>
    );
}