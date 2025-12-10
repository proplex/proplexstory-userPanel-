import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';

interface UniversalPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const UniversalPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className
}: UniversalPaginationProps) => {
  // Calculate visible pages with ellipsis
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const range = 2;

    if (totalPages <= 1) return pages;

    if (currentPage > range + 1) {
      pages.push(1);
      if (currentPage > range + 2) pages.push('...');
    }

    for (
      let i = Math.max(1, currentPage - range);
      i <= Math.min(totalPages, currentPage + range);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage < totalPages - range) {
      if (currentPage < totalPages - range - 1) pages.push('...');
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <Pagination className={className}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>

        {visiblePages.map((page, index) => (
          <PaginationItem key={index}>
            {typeof page === 'number' ? (
              <PaginationLink 
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
                className={currentPage === page ? 'bg-white text-black' : ''}
              >
                {page}
              </PaginationLink>
            ) : (
              <span className="px-2">...</span>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}; 