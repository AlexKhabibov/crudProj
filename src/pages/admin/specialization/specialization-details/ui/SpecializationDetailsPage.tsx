import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSkillsListQuery } from "@/entities/skill";
import {
    useDeleteSpecializationByIdMutation,
    useGetSpecializationByIdQuery,
} from "@/entities/specialization";
import { SpecializationCreateFormPage } from "../../specialization-create";

type SpecializationPageProps = {
    mode: "view" | "create";
};

export function SpecializationDetailsPage({
    mode,
}: SpecializationPageProps) {
    const navigate = useNavigate();
    const { id } = useParams();

    const specializationId = Number(id);

    const [isEditing, setIsEditing] = useState(false);

    const {
        data: specialization,
        isLoading: specializationLoading,
        error: specializationError,
    } = useGetSpecializationByIdQuery(specializationId, {
        skip:
            mode === "create" ||
            Number.isNaN(specializationId),
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
            skip:
                mode === "create" ||
                Number.isNaN(specializationId),
        }
    );

    const [deleteSpecialization, { isLoading: isDeleting }] =
        useDeleteSpecializationByIdMutation();

    const handleDelete = async () => {
        if (!specialization) {
            return;
        }

        await deleteSpecialization(specialization.id).unwrap();

        navigate("/admin/specializations");
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    if (
        mode === "view" &&
        (specializationLoading || skillsLoading)
    ) {
        return <p>Загрузка...</p>;
    }

    if (
        mode === "view" &&
        (specializationError || skillsError)
    ) {
        return <p>Ошибка загрузки</p>;
    }

    if (mode === "view" && !specialization) {
        return <p>Специализация не найдена</p>;
    }

    const specializationSkills =
        skillsData?.data ?? [];

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

            <h1>
                {mode === "create"
                    ? "Добавить специализацию"
                    : isEditing
                        ? "Редактирование специализации"
                        : specialization?.title}
            </h1>

            {mode === "create" ? (
                <SpecializationCreateFormPage
                    submitText="Создать"
                    onSubmit={(values) => {
                        console.log(values);
                    }}

                />
            ) : isEditing ? (
                <div>
                    <SpecializationCreateFormPage
                        initialValues={{
                            title: specialization!.title,
                            description: specialization!.description,
                            imageSrc: specialization!.imageSrc,
                        }}
                        submitText="Сохранить"
                        onSubmit={(values) => {
                            console.log(values);
                        }}
                        onCancel={handleCancelEdit}
                    />
                </div>
            ) : (
                <>
                    <div>
                        <img
                            src={specialization!.imageSrc}
                            alt={specialization!.title}
                            width={200}
                            height={200}
                        />
                    </div>

                    <div>
                        <h2>
                            {specialization!.title}
                        </h2>

                        <p>
                            {specialization!.description}
                        </p>
                    </div>

                    <div>
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
                    </div>

                    <div>
                        <p>
                            Slug: {specialization!.slug}
                        </p>

                        <p>
                            Автор:{" "}
                            {specialization!.createdBy?.username ?? "Не указан"}
                        </p>

                        <p>
                            Создано:{" "}
                            {specialization!.createdAt}
                        </p>

                        <p>
                            Обновлено:{" "}
                            {specialization!.updatedAt}
                        </p>
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleEdit}
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