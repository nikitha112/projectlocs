import React, { useState } from 'react';
import { X, MapPin, Calendar, Mail, Phone, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';
import { Item } from '../types';

interface ItemDetailsProps {
  item: Item;
  onClose: () => void;
  onClaim: (itemId: string) => void;
  potentialMatches?: Item[];
}

const ItemDetails: React.FC<ItemDetailsProps> = ({ item, onClose, onClaim, potentialMatches = [] }) => {
  const [showMatches, setShowMatches] = useState(false);
  const isLost = item.type === 'lost';
  const isClaimed = item.status === 'claimed';

  const handleClaim = () => {
    if (window.confirm('Are you sure you want to mark this item as claimed? This action cannot be undone.')) {
      onClaim(item.id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className={`px-6 py-4 border-b border-gray-200 ${
          isClaimed ? 'bg-gray-100' : isLost ? 'bg-red-50' : 'bg-green-50'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-bold text-gray-900">{item.title}</h2>
              {isClaimed && (
                <span className="flex items-center space-x-1 px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Claimed</span>
                </span>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              aria-label="Close details"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center space-x-4 mt-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isLost 
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-green-100 text-green-800 border border-green-200'
            }`}>
              {isLost ? 'Lost Item' : 'Found Item'}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {item.category}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row overflow-hidden">
          <div className="lg:w-2/3 p-6 overflow-y-auto">
            {item.imageUrl && (
              <div className="mb-6">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-medium">{item.location}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <span className="text-sm text-gray-500">Date Reported</span>
                      <p className="font-medium">{new Date(item.dateReported).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {item.reward && (
                    <div className="flex items-center space-x-3">
                      <DollarSign className="w-5 h-5 text-yellow-600" />
                      <div>
                        <span className="text-sm text-gray-500">Reward</span>
                        <p className="font-medium text-yellow-600">${item.reward}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {potentialMatches.length > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <h3 className="font-semibold text-yellow-800">Potential Matches Found!</h3>
                  </div>
                  <p className="text-yellow-700 text-sm mb-3">
                    We found {potentialMatches.length} similar {isLost ? 'found' : 'lost'} item(s) that might match.
                  </p>
                  <button
                    onClick={() => setShowMatches(!showMatches)}
                    className="text-yellow-800 hover:text-yellow-900 font-medium text-sm underline"
                  >
                    {showMatches ? 'Hide' : 'View'} Potential Matches
                  </button>
                  
                  {showMatches && (
                    <div className="mt-4 space-y-3">
                      {potentialMatches.slice(0, 3).map(match => (
                        <div key={match.id} className="bg-white rounded-lg p-3 border border-yellow-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">{match.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{match.description.substring(0, 100)}...</p>
                              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                                <span>{match.location}</span>
                                <span>{new Date(match.dateReported).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              match.type === 'lost' 
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {match.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:w-1/3 bg-gray-50 p-6 border-l border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact {isLost ? 'Owner' : 'Finder'}
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-medium">{item.contactEmail}</p>
                </div>
              </div>

              {item.contactPhone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500">Phone</span>
                    <p className="font-medium">{item.contactPhone}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <a
                href={`mailto:${item.contactEmail}?subject=Regarding ${item.type} item: ${item.title}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Mail className="w-4 h-4" />
                <span>Send Email</span>
              </a>

              {item.contactPhone && (
                <a
                  href={`tel:${item.contactPhone}`}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Phone</span>
                </a>
              )}

              {!isClaimed && (
                <button
                  onClick={handleClaim}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Mark as Claimed</span>
                </button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 leading-relaxed">
                Please be respectful when contacting about items. Verify ownership before returning valuable items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;