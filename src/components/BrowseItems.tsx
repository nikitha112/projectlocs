import React, { useState } from 'react';
import { Item, ItemType, Category } from '../types';

interface BrowseItemsProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

const BrowseItems: React.FC<BrowseItemsProps> = ({ items, onItemClick }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ItemType | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all');

  // Filter items based on search, type, category
  const filteredItems = items.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-bold mb-6 text-center">Browse Lost & Found Items</h2>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
        <input
          type="text"
          aria-label="Search items"
          placeholder="Search items..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border rounded px-3 py-2 flex-1 w-full md:w-1/3"
        />

        <select
          aria-label="Filter by type"
          value={selectedType}
          onChange={e => setSelectedType(e.target.value as ItemType | 'all')}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        <select
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value as Category | 'all')}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Bags">Bags</option>
          <option value="Jewelry">Jewelry</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <li
              key={item.id}
              onClick={() => onItemClick(item)}
              className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
            >
              {item.imageUrl && (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-2">{item.description}</p>
              <div className="flex items-center justify-between mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                  }`}
                >
                  {item.type.toUpperCase()}
                </span>
                <span className="text-gray-500 text-sm">{item.category}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 mt-6">No items found.</p>
      )}
    </div>
  );
};

export default BrowseItems;
