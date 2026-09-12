
import { useGetSpecializationByIdQuery } from "@/entities/specialization";
import { useParams } from "react-router-dom";

export function SpecializationDetailsPage() {
    const { id } = useParams();

    const specializationId = Number(id);

    const { data, isLoading, error } =
        useGetSpecializationByIdQuery(specializationId);

    console.log("id:", specializationId);
    console.log("data:", data);
    console.log("loading:", isLoading);
    console.log("error:", error);

    if (error) {
        return <p>Ошибка</p>;
    }

    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    return (
        <div>
            <p>Детализация конкретной специализации по ID {id}</p>
            <p>{data?.title}</p>
        </div>
    );
}