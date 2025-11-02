import React from "react";

import { Category, ItemType } from '../types';

interface SearchFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: Category | 'all';
  onCategoryChange: (category: Category | 'all') => void;
  selectedType: ItemType | 'all';
  onTypeChange: (type: ItemType | 'all') => void;
  onMapView: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedType,
  onTypeChange,
  onMapView
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search items..."
          className="w-full p-2 border rounded"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as Category | 'all')}
          className="p-2 border rounded"
        >
          <option value="all">All Categories</option>
          {Object.values([
            'Electronics',
            'Clothing',
            'Bags',
            'Jewelry',
            'Documents',
            'Keys',
            'Books',
            'Sports Equipment',
            'Other'
          ] as Category[]).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by type"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as ItemType | 'all')}
          className="p-2 border rounded"
        >
          <option value="all">All Types</option>
          <option value="lost">Lost Items</option>
          <option value="found">Found Items</option>
        </select>
        <button
          onClick={onMapView}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Map View
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
