import React from 'react';
import ItemCard from './ItemCard';
import { Item } from '../types';

interface ItemGridProps {
  items: Item[];
  onItemClick: (item: Item) => void;
}

const ItemGrid: React.FC<ItemGridProps> = ({ items, onItemClick }) => {
  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-3xl">🔍</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or check back later for new reports.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Recent Reports ({items.length})
        </h2>
        <div className="text-sm text-gray-600">
          Updated in real-time
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map(item => (
          <ItemCard key={item.id} item={item} onClick={() => onItemClick(item)} />
        ))}
      </div>
    </div>
  );
};

export default ItemGrid;