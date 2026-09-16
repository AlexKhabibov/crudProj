import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type {
    OnChangeFn,
    RowSelectionState,
} from "@tanstack/react-table";
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
    rowSelection: RowSelectionState;
    onRowSelectionChange: OnChangeFn<RowSelectionState>;
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
    rowSelection,
    onRowSelectionChange,
}: SpecializationsTableProps) {
    const navigate = useNavigate();

    const [openMenuId, setOpenMenuId] = useState<number | null>(
        null
    );

    const columns = useMemo(
        () =>
            columnHelper.columns([
                columnHelper.display({
                    id: "select",

                    header: ({ table }) => (
                        <input
                            type="checkbox"
                            checked={table.getIsAllPageRowsSelected()}
                            ref={(element) => {
                                if (element) {
                                    element.indeterminate =
                                        table.getIsSomePageRowsSelected() &&
                                        !table.getIsAllPageRowsSelected();
                                }
                            }}
                            onChange={table.getToggleAllPageRowsSelectedHandler()}
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
                            Название{" "}
                            {column.getIsSorted() === "asc" && "↑"}
                            {column.getIsSorted() === "desc" && "↓"}
                        </button>
                    ),

                    cell: (info) => info.getValue(),

                    sortFn: "text",
                }),

                columnHelper.accessor("description", {
                    header: "Описание",
                    cell: (info) => info.getValue(),
                    enableSorting: false,
                }),

                columnHelper.display({
                    id: "skills",

                    header: "Навыки",

                    cell: ({ row }) => {
                        const specializationId = row.original.id;

                        return skills
                            .filter((skill) =>
                                skill.specializations.some(
                                    (skillSpecialization) =>
                                        skillSpecialization.id ===
                                        specializationId
                                )
                            )
                            .map((skill) => skill.title)
                            .join(", ");
                    },
                }),

                columnHelper.display({
                    id: "options",

                    header: "Опции",

                    cell: ({ row }) => {
                        const specializationId = row.original.id;
                        const isOpen =
                            openMenuId === specializationId;

                        return (
                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOpenMenuId(
                                            isOpen
                                                ? null
                                                : specializationId
                                        );
                                    }}
                                >
                                    ⋮
                                </button>

                                {isOpen && (
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                navigate(
                                                    `/admin/specializations/${specializationId}`
                                                );
                                            }}
                                        >
                                            Редактировать
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    },
                }),
            ]),
        [skills, navigate, openMenuId]
    );

    const table = useTable({
        features,
        data: specializations,
        columns,

        getRowId: (row) => String(row.id),

        enableRowSelection: true,

        state: {
            rowSelection,
        },

        onRowSelectionChange,

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
                                    : (
                                        <table.FlexRender
                                            header={header}
                                        />
                                    )}
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
                                <table.FlexRender
                                    cell={cell}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}