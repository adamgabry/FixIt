'use client';

import { useEffect, useState } from 'react';
import {
	MapContainer,
	TileLayer,
	Marker,
	useMapEvents,
	useMap
} from 'react-leaflet';
import L from 'leaflet';
import type { LatLng } from 'leaflet';
import { Maximize2, Minimize2 } from 'lucide-react';

import 'leaflet/dist/leaflet.css';

if (typeof window !== 'undefined') {
	delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
		._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
		iconRetinaUrl:
			'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
		shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
	});
}

type LocationPickerMapProps = {
	coords: { lat: number; lng: number };
	onCoordsChangeAction: (coords: { lat: number; lng: number }) => void;
	height?: string;
};

const MapClickHandler = ({
	onCoordsChange
}: {
	onCoordsChange: (coords: { lat: number; lng: number }) => void;
}) => {
	useMapEvents({
		click: (e: { latlng: LatLng }) => {
			onCoordsChange({
				lat: e.latlng.lat,
				lng: e.latlng.lng
			});
		}
	});
	return null;
};

const MapCenterUpdater = ({
	coords
}: {
	coords: { lat: number; lng: number };
}) => {
	const map = useMap();

	useEffect(() => {
		map.setView([coords.lat, coords.lng], map.getZoom(), {
			animate: true,
			duration: 0.5
		});
	}, [coords.lat, coords.lng, map]);

	return null;
};

const LocationPickerMapContent = ({
	coords,
	onCoordsChange
}: {
	coords: { lat: number; lng: number };
	onCoordsChange: (coords: { lat: number; lng: number }) => void;
}) => (
	<MapContainer
		center={[coords.lat, coords.lng]}
		zoom={15}
		style={{ height: '100%', width: '100%' }}
		className="rounded-lg"
	>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		<MapClickHandler onCoordsChange={onCoordsChange} />
		<MapCenterUpdater coords={coords} />
		<Marker position={[coords.lat, coords.lng]} />
	</MapContainer>
);

export const LocationPickerMap = ({
	coords,
	onCoordsChangeAction,
	height = '200px'
}: LocationPickerMapProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	if (isExpanded) {
		return (
			<div
				className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4"
				onClick={() => setIsExpanded(false)}
			>
				<div
					className="bg-white rounded-lg shadow-2xl w-full max-w-4xl h-[80vh] relative"
					onClick={e => e.stopPropagation()}
				>
					<button
						onClick={() => setIsExpanded(false)}
						className="absolute top-4 right-4 z-[101] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
						title="Minimize map"
					>
						<Minimize2 className="h-5 w-5 text-gray-700" />
					</button>

					<div className="h-full w-full rounded-lg overflow-hidden">
						<LocationPickerMapContent
							coords={coords}
							onCoordsChange={onCoordsChangeAction}
						/>
					</div>

					<div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
						<p className="text-sm text-gray-700 text-center">
							Click on the map to select the issue location
						</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			{/* Small Map */}
			<div
				className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-100 group"
				style={{ height }}
			>
				<LocationPickerMapContent
					coords={coords}
					onCoordsChange={onCoordsChangeAction}
				/>

				{/* Expand Button */}
				<button
					onClick={() => setIsExpanded(true)}
					className="absolute top-2 right-2 z-[9999] bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 translate-y-1"
					title="Expand map for better selection"
				>
					<Maximize2 className="h-4 w-4 text-gray-700" />
				</button>
			</div>
		</div>
	);
};
