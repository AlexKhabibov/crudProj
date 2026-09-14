import type { Skill } from "@/entities/skill/model/types";
import type { Specialization } from "@/entities/specialization/model/types";
import {
    createColumnHelper,
    flexRender,
    tableFeatures,
    useTable,
} from "@tanstack/react-table";

interface SpecializationsTableProps {
    specializations: Specialization[];
    skills: Skill[];
}

const features = tableFeatures({});

const columnHelper = createColumnHelper<
    typeof features,
    Specialization
>();

const columns = columnHelper.columns([
    columnHelper.accessor("title", {
        header: "Название",
        cell: (info) => info.getValue(),
    }),

    columnHelper.accessor("description", {
        header: "Описание",
        cell: (info) => info.getValue(),
    }),
]);

export function SpecializationsTable({
    specializations,
    skills,
}: SpecializationsTableProps) {
    const table = useTable({
        features,
        data: specializations,
        columns,
    });

    return (
        <table>
            <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <th key={header.id}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
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
                                {cell.getValue() as React.ReactNode}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}