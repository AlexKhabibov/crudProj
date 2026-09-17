import { useState } from "react";

interface SpecializationFormValues {
    title: string;
    description: string;
    image: File | null;
}

interface SpecializationFormProps {
    initialValues?: {
        title: string;
        description: string;
        imageSrc: string;
    };
    submitText: string;
    onSubmit: (values: SpecializationFormValues) => void;
    onCancel?: () => void;
}

export function SpecializationCreateFormPage({
    initialValues,
    submitText,
    onSubmit,
    onCancel,
}: SpecializationFormProps) {
    const [title, setTitle] = useState(
        initialValues?.title ?? ""
    );

    const [description, setDescription] = useState(
        initialValues?.description ?? ""
    );

    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        onSubmit({
            title,
            description,
            image,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
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
                    required
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
                        setDescription(event.target.value)
                    }
                    required
                />
            </div>

            {initialValues?.imageSrc && (
                <div>
                    <p>Текущее изображение</p>

                    <img
                        src={initialValues.imageSrc}
                        alt={initialValues.title}
                        width={200}
                        height={200}
                    />
                </div>
            )}

            <div>
                <label htmlFor="image">
                    {initialValues
                        ? "Новое изображение"
                        : "Изображение"}
                </label>

                <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                        const file =
                            event.target.files?.[0] ?? null;

                        setImage(file);
                    }}
                    required={!initialValues}
                />
            </div>

            <button type="submit">
                {submitText}
            </button>

            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                >
                    Отмена
                </button>
            )}
        </form>
    );
}