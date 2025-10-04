import React from 'react';

const SearchFilter = ({ filters, onFiltersChange, searchPlaceholder, filterOptions }) => {
  return (
    <div className="search-filter">
      <div className="search-box">
        <span>🔍</span>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={filters.search || ''}
          onChange={(e) => onFiltersChange({ ...filters, search: e.target.value, page: 1 })}
        />
      </div>

      {filterOptions && (
        <div className="filter-select">
          <span>⚙️</span>
          <select
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({ ...filters, status: e.target.value, page: 1 })}
          >
            {filterOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;