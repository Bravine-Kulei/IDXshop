import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  maxVisiblePages?: number;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  showFirstLast = true,
  maxVisiblePages = 5
}) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    // Adjust if we're near the beginning or end
    if (currentPage <= halfVisible) {
      endPage = Math.min(totalPages, maxVisiblePages);
    }
    if (currentPage > totalPages - halfVisible) {
      startPage = Math.max(1, totalPages - maxVisiblePages + 1);
    }
    
    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }
    
    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-400">
        Page {currentPage} of {totalPages}
      </div>
      
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* First Page (if showFirstLast and not already visible) */}
        {showFirstLast && currentPage > 3 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              1
            </button>
            {currentPage > 4 && (
              <div className="flex items-center justify-center w-8 h-8 text-gray-400">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            )}
          </>
        )}

        {/* Page Numbers */}
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <div key={`ellipsis-${index}`} className="flex items-center justify-center w-8 h-8 text-gray-400">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            );
          }

          const pageNumber = page as number;
          const isCurrentPage = pageNumber === currentPage;

          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg border transition-colors ${
                isCurrentPage
                  ? 'border-[#00a8ff] bg-[#00a8ff] text-white'
                  : 'border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {pageNumber}
            </button>
          );
        })}

        {/* Last Page (if showFirstLast and not already visible) */}
        {showFirstLast && currentPage < totalPages - 2 && (
          <>
            {currentPage < totalPages - 3 && (
              <div className="flex items-center justify-center w-8 h-8 text-gray-400">
                <MoreHorizontal className="w-4 h-4" />
              </div>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              {totalPages}
            </button>
          </>
        )}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
