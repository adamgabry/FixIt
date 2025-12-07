'use client';
import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import type { LatLng } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Next.js
if (typeof window !== 'undefined') {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	delete (L.Icon.Default.prototype as any)._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
		iconRetinaUrl:
			'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
		shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
	});
}

type MapComponentProps = {
	center: [number, number];
	zoom: number;
	style?: React.CSSProperties;
	canCreateMarker?: boolean;
	initialMarkers?: LatLng[];
	draggableMarker?: boolean;
	onMarkerDragEnd?: (lat: number, lng: number) => void;
};

const ClickMarker = ({ onAdd }: { onAdd: (latlng: LatLng) => void }) => {
	useMapEvents({
		click: e => {
			onAdd(e.latlng);
		}
	});
	return null;
};

// Draggable marker component
const DraggableMarker = ({
	position,
	onDragEnd
}: {
	position: LatLng;
	onDragEnd?: (lat: number, lng: number) => void;
}) => {
	const eventHandlers = useMemo(
		() => ({
			dragend(e: { target: L.Marker }) {
				if (onDragEnd) {
					const { lat, lng } = e.target.getLatLng();
					onDragEnd(lat, lng);
				}
			}
		}),
		[onDragEnd]
	);

	return (
		<Marker
			position={position}
			draggable={true}
			eventHandlers={eventHandlers}
		/>
	);
};

const MapComponent = ({
	center,
	zoom,
	style,
	canCreateMarker = true,
	initialMarkers = [],
	draggableMarker = false,
	onMarkerDragEnd
}: MapComponentProps) => {
	// Use useMemo to derive initial state from props without useEffect
	const [addedMarkers, setAddedMarkers] = useState<LatLng[]>([]);
	const markers = useMemo(
		() => [...initialMarkers, ...addedMarkers],
		[initialMarkers, addedMarkers]
	);

	const addMarker = (latlng: LatLng) => {
		setAddedMarkers(prev => [...prev, latlng]);
		// You can also send it to your backend here
	};

	return (
		<MapContainer
			key={`map-${center[0]}-${center[1]}`}
			center={center}
			zoom={zoom}
			style={style}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{canCreateMarker && <ClickMarker onAdd={addMarker} />}

			{markers.map((pos, idx) => {
				// If draggable and this is the first marker, make it draggable
				if (draggableMarker && idx === 0 && initialMarkers.length > 0) {
					return (
						<DraggableMarker
							key={idx}
							position={pos}
							onDragEnd={onMarkerDragEnd}
						/>
					);
				}
				return <Marker key={idx} position={pos} />;
			})}
		</MapContainer>
	);
};

export default MapComponent;
