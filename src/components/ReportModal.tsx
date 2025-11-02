import React, { useState, useRef, ChangeEvent } from 'react';
import { X, Upload as UploadIcon, MapPin, Image as ImageIcon, MapPin as LocateIcon } from 'lucide-react';
import { ItemType, Category, Item } from '../types';

// Lazy-load MapComponent
const MapComponent = React.lazy(() => import('./MapComponent'));

// Extend the Item type for form handling
type FormData = {
  title: string;
  description: string;
  category: Category;
  type: ItemType;
  location: string;
  locationCoords: [number, number] | null;
  contactEmail: string;
  contactPhone?: string;
  imageUrl?: string;
  reward?: number;
  status: 'active' | 'resolved';
  imageFile?: File | null;
};

interface ReportModalProps {
  type: ItemType;
  onClose: () => void;
  onSubmit: (item: Omit<Item, 'id' | 'dateReported'>) => void;
}

const categories: Category[] = [
  'Electronics', 'Clothing', 'Bags', 'Jewelry', 'Documents', 'Keys', 'Books', 'Sports Equipment', 'Other'
];

const ReportModal: React.FC<ReportModalProps> = ({ type, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    category: 'Other',
    type,
    location: '',
    locationCoords: null,
    contactEmail: '',
    contactPhone: '',
    imageUrl: '',
    reward: undefined,
    status: 'active',
    imageFile: null
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{ display_name: string; lat: string; lon: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isLost = type === 'lost';

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // File upload handlers
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match('image.*')) {
        alert('Please select an image file (jpg, jpeg, png)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, imageFile: file, imageUrl: '' }));
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageFile: null, imageUrl: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.locationCoords) {
      alert('Please select a location on the map');
      return;
    }

    let imageUrl = formData.imageUrl;
    if (formData.imageFile) {
      imageUrl = URL.createObjectURL(formData.imageFile);
    }

    const item: Omit<Item, 'id' | 'dateReported'> = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      type: formData.type,
      location: formData.location || 'Selected on map',
      locationCoords: formData.locationCoords,
      latitude: formData.locationCoords[0],
      longitude: formData.locationCoords[1],
      contactEmail: formData.contactEmail,
      contactPhone: formData.contactPhone,
      imageUrl,
      reward: formData.reward,
      status: 'active'
    };

    onSubmit(item);
  };

  // Location search
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      setIsSearching(true);
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error(error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Select location from search results
  const handleLocationSelect = (result: { display_name: string; lat: string; lon: string }) => {
    const lat = parseFloat(result.lat);
    const lon = parseFloat(result.lon);
    setFormData(prev => ({ ...prev, location: result.display_name, locationCoords: [lat, lon] }));
    setSearchQuery(result.display_name);
    setSearchResults([]);
  };

  // Select location from map
  const handleMapLocationSelect = async (coords: [number, number] | null) => {
    if (!coords) {
      setFormData(prev => ({ ...prev, locationCoords: null }));
      return;
    }
    const [lat, lon] = coords;
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`);
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        location: data?.display_name ?? 'Selected location',
        locationCoords: [lat, lon]
      }));
      setSearchQuery(data?.display_name ?? 'Selected location');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className={`px-6 py-4 border-b border-gray-200 ${isLost ? 'bg-red-50' : 'bg-green-50'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Report {isLost ? 'Lost' : 'Found'} Item</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg transition-colors" aria-label="Close modal">
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {isLost
              ? 'Fill out the details of your lost item to help others identify it'
              : 'Help reunite someone with their belongings by reporting what you found'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-80px)] space-y-6">

          {/* Title & Category */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Item Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., iPhone 13 Pro, Blue Backpack"
              />
            </div>
            <div>
              <label htmlFor="category-select" className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                id="category-select"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder={isLost ? "Describe your lost item in detail" : "Describe the found item"}
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-1" /> Location *</label>
            <div className="relative">
              <div className="flex items-center border rounded-lg overflow-hidden">
                <MapPin className="h-5 w-5 text-gray-500 ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); searchLocation(e.target.value); }}
                  placeholder="Search for a location..."
                  className="w-full p-2 focus:outline-none"
                />
              </div>

              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                  {searchResults.map((result, idx) => (
                    <div
                      key={idx}
                      className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                      onClick={() => handleLocationSelect(result)}
                    >
                      {result.display_name.split(',').slice(0, 3).join(',')}...
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="h-64 rounded-lg overflow-hidden border border-gray-200 mt-2">
              <MapComponent
                selectedLocation={formData.locationCoords}
                onLocationSelect={handleMapLocationSelect}
                height="100%"
                zoom={formData.locationCoords ? 15 : 2}
                interactive={true}
              />
            </div>

            {formData.location && (
              <div className="mt-2 text-sm text-gray-700 p-2 bg-gray-50 rounded border border-gray-200">
                <div className="font-medium">Selected Location:</div>
                <div>{formData.location}</div>
                {formData.locationCoords && (
                  <div className="text-xs text-gray-500 mt-1 flex items-center">
                    <LocateIcon className="w-3 h-3 mr-1" />
                    {formData.locationCoords[0].toFixed(4)}, {formData.locationCoords[1].toFixed(4)}
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-gray-500 mt-1">{isSearching ? 'Searching...' : 'Search or click map'}</p>
          </div>

          {/* Contact */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 mb-2">Contact Email *</label>
              <input
                id="contactEmail"
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 mb-2">Contact Phone (Optional)</label>
              <input
                type="tel"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Enter phone number (e.g., 123-456-7890)"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label 
              htmlFor="item-image-upload" 
              className="block text-sm font-medium text-gray-700 mb-2 cursor-pointer hover:text-gray-900 transition-colors"
            >
              <UploadIcon className="w-4 h-4 inline mr-1" /> 
              Item Image {!imagePreview && !formData.imageUrl && '(Optional)'}
            </label>

            <input 
              id="item-image-upload"
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {imagePreview || formData.imageUrl ? (
              <div className="mt-2 relative group">
                <img src={imagePreview || formData.imageUrl} alt="Preview" className="h-40 w-full object-cover rounded-lg border-2 border-dashed border-gray-300" />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div onClick={triggerFileInput} className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                <div className="space-y-1 text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
            <button type="submit" className={`px-6 py-3 text-white font-medium rounded-lg transition-all transform hover:scale-105 ${isLost ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}>
              Report {isLost ? 'Lost' : 'Found'} Item
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

// Export with Suspense
const ReportModalWithSuspense: React.FC<ReportModalProps> = (props) => (
  <React.Suspense fallback={<div>Loading map...</div>}>
    <ReportModal {...props} />
  </React.Suspense>
);

export default ReportModalWithSuspense;
