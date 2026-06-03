import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

const userLocationIcon = L.divIcon({
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <path d="M16 2C9.373 2 4 7.373 4 14c0 9 12 26 12 26s12-17 12-26C28 7.373 22.627 2 16 2z"
        fill="#2563EB" stroke="#1D4ED8" stroke-width="1.5"/>
      <circle cx="16" cy="14" r="7" fill="white" opacity="0.9"/>
      <circle cx="16" cy="14" r="4" fill="#2563EB"/>
    </svg>`,
  className: '',
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -44],
});

// Marker di pet
const MapMarker = ({ position }) => {
  const map = useMap();
  const markerRef = useRef(null);

  useEffect(() => {
    if (!position || !map) return;
    
    if (markerRef.current) {
      markerRef.current.setLatLng(position);
    } else {
      markerRef.current = L.marker(position, { icon: userLocationIcon }).addTo(map);
    }
    
    return () => {
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    };
  }, [position, map]);

  return null;
};

const FlyToLocation = ({ lat, lng }) => {
  const map = useMap();
  const isFirst = useRef(true);
  
  useEffect(() => {
    if (!lat || !lng) return;
    if (isFirst.current) {
      map.setView([lat, lng], 16);
      isFirst.current = false;
    } else {
      map.flyTo([lat, lng], 16, { animate: true, duration: 1.2 });
    }
  }, [lat, lng, map]);
  
  return null;
};

export const UserMapPreview = ({ lat, lng, submitted = false }) => {
  const defaultCenter = [-0.5070, 101.4478];
  const center = lat && lng ? [lat, lng] : defaultCenter;

  return (
    <div className="map-preview-wrapper" style={{ position: 'relative' }}>

      {submitted && (
        <div className="map-preview-badge">
           Lokasi laporan Anda
        </div>
      )}

      <MapContainer
        center={center}
        zoom={lat && lng ? 16 : 12}
        style={{ height: '200px', width: '100%', borderRadius: '12px' }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {lat && lng && <MapMarker position={[lat, lng]} />}

        {lat && lng && <FlyToLocation lat={lat} lng={lng} />}
      </MapContainer>
    </div>
  );
};