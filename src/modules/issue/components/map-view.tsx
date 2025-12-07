'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { MutableRefObject } from 'react';

import { type Issue } from '@/modules/issue/schema';
import { IssueCreator } from '@/components/issue/issue-create';
import { useLocation } from '@/lib/use-location';

// Dynamic import for Leaflet map
const IssuesMapContainer = dynamic(
	() =>
		import('@/components/issue/issues-map-container').then(
			mod => mod.IssuesMapContainer
		),
	{
		ssr: false,
		loading: () => (
			<div className="flex items-center justify-center h-full bg-gray-800">
				<span className="text-gray-400">Loading map...</span>
			</div>
		)
	}
);

type MapViewProps = {
	issues: Issue[];
	onIssueCreated?: () => void;
	onOpenCreatorRef?: MutableRefObject<(() => void) | null>;
	onCreatorOpenChange?: (isOpen: boolean) => void;
};

export const MapView: React.FC<MapViewProps> = ({
	issues,
	onIssueCreated,
	onOpenCreatorRef,
	onCreatorOpenChange
}) => {
	const [isCreatorOpen, setIsCreatorOpen] = useState(false);
	const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
		null
	);
	const [defaultCoords, setDefaultCoords] = useState<{
		lat: number;
		lng: number;
	}>({ lat: 49.1951, lng: 16.6068 }); // Default: Brno
	const getMapCenterRef = useRef<(() => { lat: number; lng: number }) | null>(
		null
	);

	// Get user's current location
	const { coords: userCoords, requestLocation } = useLocation();

	// Request location when component mounts
	useEffect(() => {
		if (typeof window !== 'undefined' && navigator.geolocation) {
			requestLocation();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleMapClick = useCallback(
		(clickedCoords: { lat: number; lng: number }) => {
			setCoords(clickedCoords);
			setIsCreatorOpen(true);
		},
		[]
	);

	const handleOpenCreator = useCallback(() => {
		// Request fresh location when opening creator
		if (typeof window !== 'undefined' && navigator.geolocation) {
			requestLocation();
		}

		// Priority: user location > map center > default
		if (userCoords) {
			setCoords(userCoords);
		} else if (getMapCenterRef.current) {
			setCoords(getMapCenterRef.current());
		} else {
			setCoords({ lat: 49.1951, lng: 16.6068 }); // Default: Brno
		}
		setIsCreatorOpen(true);
	}, [userCoords, requestLocation]);

	const handleCloseCreator = useCallback(() => {
		setIsCreatorOpen(false);
		// Don't clear coords, keep them for potential reopening
	}, []);

	// Notify parent when creator open state changes
	useEffect(() => {
		if (onCreatorOpenChange) {
			onCreatorOpenChange(isCreatorOpen);
		}
	}, [isCreatorOpen, onCreatorOpenChange]);

	const handleMapReady = useCallback(
		(getCenter: () => { lat: number; lng: number }) => {
			getMapCenterRef.current = getCenter;
			// Update default coords when map is ready
			if (getMapCenterRef.current) {
				setDefaultCoords(getMapCenterRef.current());
			}
		},
		[]
	);

	// Expose openCreator function via ref
	useEffect(() => {
		if (onOpenCreatorRef) {
			onOpenCreatorRef.current = handleOpenCreator;
		}
	}, [onOpenCreatorRef, handleOpenCreator]);

	return (
		<div className="w-full h-full relative">
			<IssuesMapContainer
				issues={issues}
				onMapClick={handleMapClick}
				onMapReady={handleMapReady}
				initialUserLocation={userCoords}
			/>
			<IssueCreator
				isOpen={isCreatorOpen}
				coords={coords ?? defaultCoords}
				onCloseAction={handleCloseCreator}
				onSubmitAction={async () => {
					// This will be handled by IssueCreator internally
					if (onIssueCreated) {
						onIssueCreated();
					}
				}}
			/>
		</div>
	);
};
