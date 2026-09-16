import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSkillsListQuery } from "@/entities/skill";
import {
    useGetSpecializationByIdQuery,
    useUpdateSpecializationByIdMutation,
    useDeleteSpecializationByIdMutation,
} from "@/entities/specialization";

export function SpecializationDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const specializationId = Number(id);

    const {
        data: specialization,
        isLoading: specializationLoading,
        error: specializationError,
        refetch,
    } = useGetSpecializationByIdQuery(specializationId, {
        skip: Number.isNaN(specializationId),
    });

    const {
        data: skillsData,
        isLoading: skillsLoading,
        error: skillsError,
    } = useGetSkillsListQuery(
        {
            page: 1,
            limit: 100,
            specializations: String(specializationId),
        },
        {
            skip: Number.isNaN(specializationId),
        }
    );

    const [updateSpecialization, { isLoading: isUpdating }] =
        useUpdateSpecializationByIdMutation();

    const [deleteSpecialization, { isLoading: isDeleting }] =
        useDeleteSpecializationByIdMutation();

    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageSrc, setImageSrc] = useState("");

    const handleStartEditing = () => {
        if (!specialization) {
            return;
        }

        setTitle(specialization.title);
        setDescription(specialization.description);
        setImageSrc(specialization.imageSrc);

        setIsEditing(true);
    };

    const handleCancelEditing = () => {
        setIsEditing(false);
    };

    const handleSave = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!specialization) {
            return;
        }

        await updateSpecialization({
            id: specialization.id,
            body: {
                title,
                description,
                imageSrc,
                specializationImage: "",
            },
        }).unwrap();

        await refetch();

        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!specialization) {
            return;
        }

        await deleteSpecialization(specialization.id).unwrap();

        navigate("/admin/specializations");
    };

    if (specializationLoading || skillsLoading) {
        return <p>Загрузка...</p>;
    }

    if (specializationError || skillsError) {
        return <p>Ошибка загрузки</p>;
    }

    if (!specialization) {
        return <p>Специализация не найдена</p>;
    }

    const specializationSkills = skillsData?.data ?? [];

    return (
        <main>
            <button
                type="button"
                onClick={() =>
                    navigate("/admin/specializations")
                }
            >
                Назад
            </button>

            {isEditing ? (
                <form onSubmit={handleSave}>
                    <h1>Редактирование специализации</h1>

                    <div>
                        <label htmlFor="title">
                            Название
                        </label>

                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(event) =>
                                setTitle(event.target.value)
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="description">
                            Описание
                        </label>

                        <textarea
                            id="description"
                            value={description}
                            onChange={(event) =>
                                setDescription(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="imageSrc">
                            URL изображения
                        </label>

                        <input
                            id="imageSrc"
                            type="text"
                            value={imageSrc}
                            onChange={(event) =>
                                setImageSrc(event.target.value)
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isUpdating}
                    >
                        {isUpdating
                            ? "Сохранение..."
                            : "Сохранить"}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancelEditing}
                        disabled={isUpdating}
                    >
                        Отмена
                    </button>
                </form>
            ) : (
                <>
                    <h1>{specialization.title}</h1>

                    <img
                        src={specialization.imageSrc}
                        alt={specialization.title}
                        width={200}
                        height={200}
                    />

                    <p>
                        {specialization.description}
                    </p>

                    <section>
                        <h2>Навыки</h2>

                        {specializationSkills.length === 0 ? (
                            <p>Навыки не найдены</p>
                        ) : (
                            <ul>
                                {specializationSkills.map(
                                    (skill) => (
                                        <li key={skill.id}>
                                            {skill.title}
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </section>

                    <div>
                        <button
                            type="button"
                            onClick={handleStartEditing}
                        >
                            Редактировать
                        </button>

                        <button
                            type="button"
                            disabled={isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting
                                ? "Удаление..."
                                : "Удалить"}
                        </button>
                    </div>
                </>
            )}
        </main>
    );
}