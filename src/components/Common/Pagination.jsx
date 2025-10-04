import React from 'react';

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages } = pagination;

  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      <button
        className="btn btn-outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        ← Previous
      </button>

      <div className="pagination-pages">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
          <button
            key={pageNum}
            className={`pagination-page ${pageNum === page ? 'active' : ''}`}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        className="btn btn-outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next →
      </button>
    </div>
  );
};

export default Pagination;