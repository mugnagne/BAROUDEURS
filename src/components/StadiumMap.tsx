import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { STADIUMS } from '@/data/worldCupData';

// Fix Leaflet's default icon path issues with webpack/vite
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25,41],
    iconAnchor: [12,41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export const StadiumMap = () => {
  return (
    <div className="w-full h-[400px] md:h-[600px] border-4 sm:border-8 border-neo-black shadow-neo-lg bg-neo-cream relative z-10 mb-12">
      <MapContainer 
        center={[39.8283, -98.5795]} 
        zoom={3} 
        scrollWheelZoom={false}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {STADIUMS.map((stadium) => (
          <Marker 
            key={stadium.name} 
            position={[stadium.coords[0], stadium.coords[1]] as [number, number]}
          >
            <Popup>
              <div className="font-bold text-base mb-1">{stadium.name}</div>
              <div className="text-sm">📍 {stadium.city}</div>
              <div className="text-sm">👥 {stadium.capacity.toLocaleString()} places</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
