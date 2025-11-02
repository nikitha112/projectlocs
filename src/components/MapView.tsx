import React, { useRef, useEffect } from 'react';
import { MapPin, X } from 'lucide-react';
import { Item } from '../types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapViewProps {
  items: Item[];
  onClose: () => void;
  onItemClick: (item: Item) => void;
}

const MapView: React.FC<MapViewProps> = ({ items, onClose, onItemClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  const handleItemClick = React.useCallback((item: Item) => {
    onItemClick(item);
  }, [onItemClick]);

  const locations = React.useMemo(
    () =>
      items.reduce((acc, item) => {
        if (!acc[item.location]) acc[item.location] = [];
        acc[item.location].push(item);
        return acc;
      }, {} as Record<string, Item[]>),
    [items]
  );

  useEffect(() => {
    if (!mapRef.current) return;

    const defaultCenter = (() => {
      const itemWithCoords = items.find(i => i.latitude && i.longitude);
      return itemWithCoords
        ? [itemWithCoords.latitude!, itemWithCoords.longitude!] as [number, number]
        : [20.5937, 78.9629] as [number, number]; // India
    })();

    if (!mapInstance.current) {
      mapInstance.current = L.map(mapRef.current, {
        center: defaultCenter,
        zoom: 13,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
      }).addTo(mapInstance.current);
    }

    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const newMarkers = Object.entries(locations).map(([location, locationItems]) => {
      const item = locationItems[0];
      if (!item?.latitude || !item?.longitude) return null;

      const marker = L.marker([item.latitude, item.longitude], { title: location }).addTo(mapInstance.current!);

      marker.bindPopup(`
        <div class="p-2">
          <h4 class="font-bold">${location}</h4>
          <p>${locationItems.length} items</p>
          <button class="view-details-btn mt-2 px-2 py-1 bg-blue-500 text-white rounded text-sm" data-id="${item.id}">
            View Details
          </button>
        </div>
      `);

      marker.on('popupopen', () => {
        const popupEl = marker.getPopup()?.getElement();
        if (popupEl) {
          const btn = popupEl.querySelector('.view-details-btn');
          if (btn) {
            btn.addEventListener('click', () => handleItemClick(item));
          }
        }
      });

      return marker;
    }).filter(Boolean) as L.Marker[];

    markersRef.current = newMarkers;

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, [items, locations, handleItemClick]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[80vh] overflow-hidden">
        {/* header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-blue-50 flex justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Items Map View</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-white/50 rounded-lg"
            aria-label="Close map view"
            title="Close map view"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* map */}
        <div className="p-6 h-full">
          <div ref={mapRef} className="w-full h-full min-h-[500px] rounded-lg overflow-hidden border border-gray-200" />
        </div>
      </div>
    </div>
  );
};

export default MapView;
