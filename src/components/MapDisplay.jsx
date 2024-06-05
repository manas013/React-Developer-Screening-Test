// src/components/MapDisplay.js
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Importing marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow
});

const MapEvents = ({ setLatLon }) => {
  useMapEvents({
    click: (e) => {
      if (e.originalEvent.shiftKey) {
        const { lat, lng } = e.latlng;
        console.log("Map Clicked at:", lat, lng);
        setLatLon({ lat, lon: lng });
      }
    }
  });
  return null;
};

const UpdateMapView = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.setView(coords, map.getZoom());
    }
  }, [coords, map]);
  return null;
};

const MapDisplay = ({ position, weather, setLatLon }) => {
  return (
    <MapContainer 
      center={position} 
      zoom={11} 
      style={{ height: "500px", width: "100%" }}
      key={JSON.stringify(position)}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <UpdateMapView coords={position} />
      <Marker position={position} icon={defaultIcon}>
        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
          {weather.name}, {weather.country}
        </Tooltip>
        <Popup>
          {weather.name}, {weather.country}
        </Popup>
      </Marker>
      <MapEvents setLatLon={setLatLon} />
    </MapContainer>
  );
};

export default MapDisplay;
