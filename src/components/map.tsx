"use client";
import { useState} from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LatLng } from "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
	iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
	shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type MapComponentProps = {
	center: [number, number];
	zoom: number;
	style?: React.CSSProperties;
    canCreateMarker?: boolean;
    initialMarkers?: LatLng[];
};

function ClickMarker({ onAdd }: { onAdd: (latlng: LatLng) => void }) {
  useMapEvents({
    click(e) {
      onAdd(e.latlng);
    },
  });
  return null;
}

const MapComponent = ({ center, zoom, style, canCreateMarker = true, initialMarkers = [] }: MapComponentProps) => {
  const [markers, setMarkers] = useState<LatLng[]>(initialMarkers);

  const addMarker = (latlng: LatLng) => {
    setMarkers(prev => [...prev, latlng]);
    // You can also send it to your backend here
  };

  return (
    <MapContainer center={center} zoom={zoom} style={style}>
        <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      
        {canCreateMarker && <ClickMarker onAdd={addMarker} />}

        {markers.map((pos, idx) => (
            <Marker key={idx} position={pos} />
        ))}
    </MapContainer>
  );
}

export default MapComponent;
