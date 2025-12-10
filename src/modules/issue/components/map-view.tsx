'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { MutableRefObject } from 'react';

import { type Issue } from '@/modules/issue/schema';
import { IssueCreator } from '@/components/issue/issue-create';
import { useLocation } from '@/lib/use-location';

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
	currentUserId: string | null;
	onIssueCreatedAction?: () => void;
	onOpenCreatorRefAction?: MutableRefObject<(() => void) | null>;
	onCreatorOpenChangeAction?: (isOpen: boolean) => void;
};

export const MapView: React.FC<MapViewProps> = ({
	issues,
	currentUserId,
	onIssueCreatedAction,
	onOpenCreatorRefAction,
	onCreatorOpenChangeAction
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

	const { coords: userCoords, requestLocation } = useLocation();

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
	}, []);

	useEffect(() => {
		if (onCreatorOpenChangeAction) {
			onCreatorOpenChangeAction(isCreatorOpen);
		}
	}, [isCreatorOpen, onCreatorOpenChangeAction]);

	const handleMapReady = useCallback(
		(getCenter: () => { lat: number; lng: number }) => {
			getMapCenterRef.current = getCenter;
			if (getMapCenterRef.current) {
				setDefaultCoords(getMapCenterRef.current());
			}
		},
		[]
	);

	useEffect(() => {
		if (onOpenCreatorRefAction) {
			onOpenCreatorRefAction.current = handleOpenCreator;
		}
	}, [onOpenCreatorRefAction, handleOpenCreator]);

	return (
		<div className="w-full h-full relative">
			<IssuesMapContainer
				issues={issues}
				currentUserId={currentUserId}
				onMapClickAction={handleMapClick}
				onMapReadyAction={handleMapReady}
				initialUserLocation={userCoords}
			/>
			<IssueCreator
				isOpen={isCreatorOpen}
				coords={coords ?? defaultCoords}
				onCloseAction={handleCloseCreator}
				onSubmitAction={async () => {
					if (onIssueCreatedAction) {
						onIssueCreatedAction();
					}
				}}
			/>
		</div>
	);
};
