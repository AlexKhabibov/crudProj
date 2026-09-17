import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetSkillsListQuery } from "@/entities/skill";
import {
    useCreateSpecializationMutation,
    useDeleteSpecializationByIdMutation,
    useGetSpecializationByIdQuery,
    useUpdateSpecializationByIdMutation,
} from "@/entities/specialization";
import { SpecializationCreateFormPage } from "../../specialization-create";
import { fileToBase64 } from "@/shared/lib/file/toBase64";

type SpecializationDetailsPageProps = {
    mode: "view" | "create";
};

interface SpecializationFormValues {
    title: string;
    description: string;
    image: File | null;
}

export function SpecializationDetailsPage({
    mode,
}: SpecializationDetailsPageProps) {
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

    const [createSpecialization, { isLoading: isCreating }] =
        useCreateSpecializationMutation();

    const [updateSpecialization, { isLoading: isUpdating }] =
        useUpdateSpecializationByIdMutation();

    const [deleteSpecialization, { isLoading: isDeleting }] =
        useDeleteSpecializationByIdMutation();

    const handleCreate = async (
        values: SpecializationFormValues
    ) => {
        if (!values.image) {
            return;
        }

        const specializationImage = await fileToBase64(
            values.image
        );

        await createSpecialization({
            title: values.title,
            description: values.description,
            imageSrc: "",
            specializationImage,
        }).unwrap();

        navigate("/admin/specializations");
    };

    const handleUpdate = async (
        values: SpecializationFormValues
    ) => {
        if (!specialization) {
            return;
        }

        const specializationImage = values.image
            ? await fileToBase64(values.image)
            : "";

        await updateSpecialization({
            id: specialization.id,
            body: {
                title: values.title,
                description: values.description,
                imageSrc: specialization.imageSrc,
                specializationImage,
            },
        }).unwrap();

        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (!specialization) {
            return;
        }

        await deleteSpecialization(
            specialization.id
        ).unwrap();

        navigate("/admin/specializations");
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

    if (mode === "create") {
        return (
            <main>
                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/specializations"
                        )
                    }
                >
                    Назад
                </button>

                <h1>Добавить специализацию</h1>

                <SpecializationCreateFormPage
                    submitText={
                        isCreating
                            ? "Создание..."
                            : "Создать"
                    }
                    onSubmit={handleCreate}
                />
            </main>
        );
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
                {isEditing
                    ? "Редактирование специализации"
                    : specialization!.title}
            </h1>

            {isEditing ? (
                <SpecializationCreateFormPage
                    initialValues={{
                        title: specialization!.title,
                        description:
                            specialization!.description,
                        imageSrc:
                            specialization!.imageSrc,
                    }}
                    submitText={
                        isUpdating
                            ? "Сохранение..."
                            : "Сохранить"
                    }
                    onSubmit={handleUpdate}
                    onCancel={() =>
                        setIsEditing(false)
                    }
                />
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

                        {specializationSkills.length ===
                            0 ? (
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
                            Slug:{" "}
                            {specialization!.slug}
                        </p>

                        <p>
                            Автор:{" "}
                            {specialization!.createdBy
                                ?.username ??
                                "Не указан"}
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
                            onClick={() =>
                                setIsEditing(true)
                            }
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