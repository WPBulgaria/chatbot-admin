import { Button } from '@headlessui/react';
import clsx from 'clsx';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  itemLabel = 'items',
}) => {
  if (totalPages <= 1) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pageNumbers: (number | 'ellipsis')[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }

    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push('ellipsis');
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const baseButtonStyles =
    'px-3 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const defaultButtonStyles =
    'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed';
  const activeButtonStyles = 'bg-blue-600 text-white';

  return (
    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Showing <span className="font-medium text-gray-900">{startItem}</span> to{' '}
        <span className="font-medium text-gray-900">{endItem}</span> of{' '}
        <span className="font-medium text-gray-900">{totalItems}</span> {itemLabel}
      </div>

      <nav className="flex items-center gap-1">
        <Button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className={clsx(baseButtonStyles, defaultButtonStyles)}
        >
          Previous
        </Button>

        {getPageNumbers().map((pageNum, index) =>
          pageNum === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-gray-500">
              ...
            </span>
          ) : (
            <Button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={clsx(
                baseButtonStyles,
                currentPage === pageNum ? activeButtonStyles : defaultButtonStyles,
              )}
            >
              {pageNum}
            </Button>
          ),
        )}

        <Button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className={clsx(baseButtonStyles, defaultButtonStyles)}
        >
          Next
        </Button>
      </nav>
    </div>
  );
};
