import { useState } from "react";

interface SearchSpecializationsProps {
    onSearch: (value: string) => void;
}

export function SearchSpecializations({
    onSearch,
}: SearchSpecializationsProps) {
    const [value, setValue] = useState("");

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        onSearch(value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Поиск специализации"
            />

            <button type="submit">
                Найти
            </button>
        </form>
    );
}