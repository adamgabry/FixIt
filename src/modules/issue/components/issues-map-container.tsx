'use client';

import React from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { type Issue } from '@/modules/issue/schema';
import { IssueMarker } from '@/modules/issue/components/issue-marker';
import { LocationButton } from '@/components/buttons/location-button';
import { MapSearch } from '@/components/map-search';

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
	currentUserId: string | null;
	center?: [number, number];
	zoom?: number;
	onMapClickAction?: (coords: { lat: number; lng: number }) => void;
	onMapReadyAction?: (getCenter: () => { lat: number; lng: number }) => void;
	initialUserLocation?: { lat: number; lng: number } | null;
};

const MapClickHandler = ({
	onMapClick
}: {
	onMapClick?: (coords: { lat: number; lng: number }) => void;
}) => {
	useMapEvents({
		click: (e: L.LeafletMouseEvent) => {
			const target = e.originalEvent.target as HTMLElement;
			if (target) {
				const locationButtonContainer = target.closest(
					'[data-location-button]'
				);
				if (locationButtonContainer) {
					return;
				}
				const mapSearchContainer = target.closest('[data-map-search]');
				if (mapSearchContainer) {
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

const MapCenterGetter = ({
	onMapReady
}: {
	onMapReady?: (getCenter: () => { lat: number; lng: number }) => void;
}) => {
	const map = useMap();
	const hasCalledRef = React.useRef(false);

	React.useEffect(() => {
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

const AutoCenterOnLocation = ({
	userLocation
}: {
	userLocation?: { lat: number; lng: number } | null;
}) => {
	const map = useMap();
	const hasCenteredRef = React.useRef(false);

	React.useEffect(() => {
		if (userLocation && !hasCenteredRef.current) {
			map.flyTo([userLocation.lat, userLocation.lng], 15, {
				animate: true,
				duration: 1.5
			});
			hasCenteredRef.current = true;
		}
	}, [userLocation, map]);

	return null;
};

export const IssuesMapContainer = ({
	issues,
	currentUserId,
	center = [49.1951, 16.6068], // Default: Brno
	zoom = 13,
	onMapClickAction,
	onMapReadyAction,
	initialUserLocation
}: IssuesMapContainerProps) => (
	<MapContainer
		center={center}
		zoom={zoom}
		style={{ height: '100%', width: '100%' }}
		className="z-0"
		zoomControl
		scrollWheelZoom
	>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		<div
			className="absolute top-4 right-4 w-auto min-w-[220px] max-w-[280px] z-[1000]"
			data-map-search
			onClick={e => e.stopPropagation()}
		>
			<MapSearch />
		</div>
		<LocationButton />
		<MapClickHandler onMapClick={onMapClickAction} />
		<MapCenterGetter onMapReady={onMapReadyAction} />
		<AutoCenterOnLocation userLocation={initialUserLocation} />
		{issues.map(issue => (
			<IssueMarker
				key={issue.id}
				issue={issue}
				currentUserId={currentUserId}
				position={[issue.latitude, issue.longitude]}
			/>
		))}
	</MapContainer>
);
