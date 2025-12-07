'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { MutableRefObject } from 'react';

import { type Issue } from '@/modules/issue/schema';
import { IssueCreator } from '@/components/issue/issue-create';

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
	const getMapCenterRef = useRef<(() => { lat: number; lng: number }) | null>(
		null
	);

	const handleMapClick = useCallback(
		(clickedCoords: { lat: number; lng: number }) => {
			setCoords(clickedCoords);
			setIsCreatorOpen(true);
		},
		[]
	);

	const handleOpenCreator = useCallback(() => {
		// If no coords set, use current map center or default location
		if (!coords) {
			if (getMapCenterRef.current) {
				setCoords(getMapCenterRef.current());
			} else {
				setCoords({ lat: 48.1486, lng: 17.1077 }); // Default: Bratislava
			}
		}
		setIsCreatorOpen(true);
	}, [coords]);

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
		<div className="flex-1 relative">
			<IssuesMapContainer
				issues={issues}
				onMapClick={handleMapClick}
				onMapReady={handleMapReady}
			/>
			<IssueCreator
				isOpen={isCreatorOpen}
				coords={
					coords ||
					(getMapCenterRef.current
						? getMapCenterRef.current()
						: { lat: 48.1486, lng: 17.1077 })
				}
				onClose={handleCloseCreator}
				onSubmit={async () => {
					// This will be handled by IssueCreator internally
					if (onIssueCreated) {
						onIssueCreated();
					}
				}}
			/>
		</div>
	);
};
