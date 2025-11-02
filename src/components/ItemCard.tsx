import React from 'react';
import { MapPin, Calendar, Mail, Phone, DollarSign } from 'lucide-react';
import { Item } from '../types';

interface ItemCardProps {
  item: Item;
  onClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, onClick }) => {
  const isLost = item.type === 'lost';
  const isClaimed = item.status === 'claimed';
  
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 border border-gray-100 overflow-hidden cursor-pointer ${
        isClaimed ? 'opacity-75' : ''
      }`}
    >
      <div className="relative">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover"
          />
        )}
        <div className="absolute top-3 left-3">
          <div className="flex flex-col space-y-1">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isLost 
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
              {isLost ? 'Lost' : 'Found'}
            </span>
            {isClaimed && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                Claimed
              </span>
            )}
          </div>
        </div>
        {item.reward && (
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 flex items-center space-x-1">
              <DollarSign className="w-3 h-3" />
              <span>{item.reward}</span>
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
          <span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-md">
            {item.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>

        <div className="space-y-2 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Reported {new Date(item.dateReported).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Contact {isLost ? 'Owner' : 'Finder'}:</span>
            {!isClaimed && (
              <div className="flex items-center space-x-2">
                <a
                  href={`mailto:${item.contactEmail}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
                {item.contactPhone && (
                  <a
                    href={`tel:${item.contactPhone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Call Phone"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;