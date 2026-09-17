import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    createColumnHelper,
    createSortedRowModel,
    rowSelectionFeature,
    rowSortingFeature,
    tableFeatures,
    useTable,
    type OnChangeFn,
    type RowSelectionState,
} from "@tanstack/react-table";
import type { Specialization } from "@/entities/specialization/model/types";
import type { Skill } from "@/entities/skill/model/types";

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
                            checked={table.getIsAllRowsSelected()}
                            ref={(element) => {
                                if (element) {
                                    element.indeterminate =
                                        table.getIsSomeRowsSelected() &&
                                        !table.getIsAllRowsSelected();
                                }
                            }}
                            onChange={table.getToggleAllRowsSelectedHandler()}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        />
                    ),
                    cell: ({ row }) => (
                        <input
                            type="checkbox"
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onChange={row.getToggleSelectedHandler()}
                            onClick={(event) =>
                                event.stopPropagation()
                            }
                        />
                    ),
                }),

                columnHelper.accessor("imageSrc", {
                    id: "image",
                    header: "Изображение",
                    cell: ({ row }) => (
                        <img
                            src={row.original.imageSrc}
                            alt={row.original.title}
                            width={48}
                            height={48}
                        />
                    ),
                }),

                columnHelper.accessor("title", {
                    header: "Название",
                    cell: ({ getValue }) => getValue(),
                }),

                columnHelper.accessor("description", {
                    header: "Описание",
                    cell: ({ getValue }) => getValue(),
                }),

                columnHelper.display({
                    id: "skills",
                    header: "Навыки",
                    cell: ({ row }) => {
                        const specializationSkills =
                            skills.filter((skill) =>
                                skill.specializations.some(
                                    (specialization) =>
                                        specialization.id ===
                                        row.original.id
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
                    header: "",
                    cell: ({ row }) => {
                        const specializationId =
                            row.original.id;

                        const isOpen =
                            openMenuId === specializationId;

                        return (
                            <div>
                                <button
                                    type="button"
                                    onClick={(event) => {
                                        event.stopPropagation();

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
                                    <div
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpenMenuId(null);

                                                navigate(
                                                    `/admin/specializations/${specializationId}`
                                                );
                                            }}
                                        >
                                            Открыть
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    },
                }),
            ]),
        [navigate, openMenuId, skills]
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
                    <tr
                        key={row.id}
                        onClick={() =>
                            navigate(
                                `/admin/specializations/${row.original.id}`
                            )
                        }
                        style={{
                            cursor: "pointer",
                        }}
                    >
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