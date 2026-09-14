
import { useGetSpecializationByIdQuery } from "@/entities/specialization";
import { useParams } from "react-router-dom";

export function SpecializationDetailsPage() {
    const { id } = useParams();

    const specializationId = Number(id);

    const { data, isLoading, error } =
        useGetSpecializationByIdQuery(specializationId);

    if (error) {
        return <p>Ошибка</p>;
    }

    if (isLoading) {
        return <p>Загрузка...</p>;
    }

    return (
        <>
            <h1>Детализация конкретной специализации по ID {id}</h1>

            <p>Название - {data?.title}</p>
        </>
    );
}