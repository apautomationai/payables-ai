import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@workspace/ui/components/pagination";

interface JobsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export function JobsPagination({ currentPage, totalPages, onPageChange }: JobsPaginationProps) {
    if (totalPages <= 1) return null;

    // Show limited page numbers on mobile
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            // Show all pages if total is small
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Always show first page
        pages.push(1);

        if (currentPage > 3) {
            pages.push("...");
        }

        // Show pages around current page
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push("...");
        }

        // Always show last page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <Pagination>
            <PaginationContent className="flex-wrap">
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
                {pageNumbers.map((page, index) =>
                    typeof page === "string" ? (
                        <PaginationItem key={`ellipsis-${index}`}>
                            <span className="px-2">...</span>
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={page} className="hidden sm:block">
                            <PaginationLink
                                onClick={() => onPageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}
                {/* Show current page on mobile */}
                <PaginationItem className="sm:hidden">
                    <span className="px-3 py-2 text-sm">
                        {currentPage} / {totalPages}
                    </span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
