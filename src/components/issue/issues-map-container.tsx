'use client';

import React from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { LatLng } from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { type Issue } from '@/modules/issue/schema';
import { IssueMarker } from '@/components/issue/issue-marker';
import { LocationButton } from '@/components/location-button';

// Fix for default marker icon in Next.js
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

type IssuesMapContainerProps = {
	issues: Issue[];
	center?: [number, number];
	zoom?: number;
	onMapClick?: (coords: { lat: number; lng: number }) => void;
	onMapReady?: (getCenter: () => { lat: number; lng: number }) => void;
};

// Component to handle map clicks
const MapClickHandler = ({
	onMapClick
}: {
	onMapClick?: (coords: { lat: number; lng: number }) => void;
}) => {
	useMapEvents({
		click: (e: L.LeafletMouseEvent) => {
			// Check if the click originated from the location button or its children
			const target = e.originalEvent.target as HTMLElement;
			if (target) {
				// Check if the click target is within the location button container
				const locationButtonContainer = target.closest(
					'[data-location-button]'
				);
				if (locationButtonContainer) {
					// Ignore clicks from location button
					return;
				}
			}

			if (onMapClick) {
				onMapClick({
					lat: e.latlng.lat,
					lng: e.latlng.lng
				});
			}
		}
	});
	return null;
};

// Component to expose map center getter
const MapCenterGetter = ({
	onMapReady
}: {
	onMapReady?: (getCenter: () => { lat: number; lng: number }) => void;
}) => {
	const map = useMap();
	const hasCalledRef = React.useRef(false);

	React.useEffect(() => {
		// Only call onMapReady once when map is ready
		if (onMapReady && !hasCalledRef.current) {
			onMapReady(() => {
				const center = map.getCenter();
				return {
					lat: center.lat,
					lng: center.lng
				};
			});
			hasCalledRef.current = true;
		}
	}, [map, onMapReady]);

	return null;
};

export const IssuesMapContainer = ({
	issues,
	center = [48.1486, 17.1077], // Default: Bratislava
	zoom = 13,
	onMapClick,
	onMapReady
}: IssuesMapContainerProps) => (
	<MapContainer
		center={center}
		zoom={zoom}
		style={{ height: '100%', width: '100%' }}
		className="z-0"
	>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		<LocationButton />
		<MapClickHandler onMapClick={onMapClick} />
		<MapCenterGetter onMapReady={onMapReady} />
		{issues.map(issue => (
			<IssueMarker
				key={issue.id}
				issue={issue}
				position={[issue.latitude, issue.longitude]}
			/>
		))}
	</MapContainer>
);
