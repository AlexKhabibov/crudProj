import type { Skill } from "@/entities/skill/model/types";
import type { Specialization } from "@/entities/specialization/model/types";
import {
    createColumnHelper,
    createSortedRowModel,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_text,
    tableFeatures,
    useTable,
} from "@tanstack/react-table";

interface SpecializationsTableProps {
    specializations: Specialization[];
    skills: Skill[];
}

const features = tableFeatures({
    rowSelectionFeature,
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: {
        text: sortFn_text,
    },
});

const columnHelper = createColumnHelper<
    typeof features,
    Specialization
>();

export function SpecializationsTable({
    specializations,
    skills,
}: SpecializationsTableProps) {
    const columns = columnHelper.columns([
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <input
                    type="checkbox"
                    checked={table.getIsAllRowsSelected()}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
        }),

        columnHelper.display({
            id: "image",
            header: "Изображение",
            cell: ({ row }) => (
                <img
                    src={row.original.imageSrc}
                    alt={row.original.title}
                    width={50}
                    height={50}
                />
            ),
        }),

        columnHelper.accessor("title", {
            header: ({ column }) => (
                <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                >
                    Название
                    {column.getIsSorted() === "asc" && " ↑"}
                    {column.getIsSorted() === "desc" && " ↓"}
                </button>
            ),
            sortFn: "text",
        }),

        columnHelper.accessor("description", {
            header: "Описание",
            enableSorting: false,
        }),

        columnHelper.display({
            id: "skills",
            header: "Навыки",
            cell: ({ row }) => {
                const specializationSkills = skills.filter((skill) =>
                    skill.specializations.some(
                        (skillSpecialization) =>
                            skillSpecialization.id === row.original.id
                    )
                );

                if (specializationSkills.length === 0) {
                    return "—";
                }

                return specializationSkills
                    .map((skill) => skill.title)
                    .join(", ");
            },
        }),

        columnHelper.display({
            id: "options",
            header: "Опции",
            cell: () => (
                <button type="button">
                    ⋯
                </button>
            ),
        }),
    ]);

    const table = useTable({
        features,
        data: specializations,
        columns,
        getRowId: (row) => String(row.id),
        enableRowSelection: true,
        enableSortingRemoval: false,
    });

    return (
        <table>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {header.isPlaceholder
                                    ? null
                                    : <table.FlexRender header={header} />}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>

            <tbody>
                {table.getRowModel().rows.map((row) => (
                    <tr key={row.id}>
                        {row.getAllCells().map((cell) => (
                            <td key={cell.id}>
                                <table.FlexRender cell={cell} />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}