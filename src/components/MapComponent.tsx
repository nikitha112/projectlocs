import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapComponent.module.css';

// Fix default Leaflet marker icons
delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// LocationMarker component
interface LocationMarkerProps {
  position: [number, number] | null;
  setPosition?: (pos: [number, number]) => void;
  interactive?: boolean;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({ position, setPosition, interactive = true }) => {
  useMapEvents({
    click(e) {
      if (interactive && setPosition) setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position ? (
    <Marker position={position}>
      <Popup>Selected Location</Popup>
    </Marker>
  ) : null;
};

// MapComponent
interface MapComponentProps {
  selectedLocation: [number, number] | null;
  onLocationSelect?: (coords: [number, number]) => void;
  zoom?: number;
  height?: string | number;
  interactive?: boolean;
  className?: string;
}

const MapComponent: React.FC<MapComponentProps> = ({
  selectedLocation,
  onLocationSelect,
  zoom = 13,
  height = '300px',
  interactive = true,
  className = '',
}) => {
  const mapRef = useRef<L.Map>(null);

  useEffect(() => {
    if (mapRef.current && selectedLocation) {
      mapRef.current.flyTo(selectedLocation, zoom);
    }
  }, [selectedLocation, zoom]);

  return (
    <div className={`${styles?.mapWrapper || ''} ${className}`} style={{ height }}>
      <MapContainer
        center={selectedLocation || [0, 0]}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          position={selectedLocation}
          setPosition={interactive ? onLocationSelect : undefined}
          interactive={interactive}
        />
      </MapContainer>
    </div>
  );
};
export default MapComponent;
