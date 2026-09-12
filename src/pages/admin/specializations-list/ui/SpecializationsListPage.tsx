import { useGetSpecializationsListQuery } from "@/entities/specialization";

export function SpecializationsListPage() {
    const { data, isLoading, error } = useGetSpecializationsListQuery({
        page: 1,
        limit: 10,
    });

    console.log("data:", data);
    console.log("loading:", isLoading);
    console.log("error:", error);

    return (
        <>
            <p>{data?.page}</p>
        </>);
}