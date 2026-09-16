interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

export function Pagination({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}: PaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div>
            <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            >
                Назад
            </button>

            <span>
                {currentPage} из {totalPages}
            </span>

            <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            >
                Вперёд
            </button>
        </div>
    );
}