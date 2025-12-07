'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { FloatingAddButton } from '@/components/floating-add-button';
import { IssueCreator } from '@/components/issue/issue-create';
import { useLocation } from '@/lib/use-location';

export const IssuesListClient = () => {
	const router = useRouter();
	const [isCreatorOpen, setIsCreatorOpen] = useState(false);

	// Default coordinates: Brno (fallback)
	const defaultCoords = { lat: 49.1951, lng: 16.6068 };

	// Get user's current location
	const { coords: userCoords, requestLocation } = useLocation();

	// Use current location if available, otherwise fallback to default
	const coords = userCoords ?? defaultCoords;

	// Request location when component mounts
	useEffect(() => {
		if (typeof window !== 'undefined' && navigator.geolocation) {
			requestLocation();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleOpenCreator = () => {
		// Request fresh location when opening creator (if not already available)
		if (typeof window !== 'undefined' && navigator.geolocation && !userCoords) {
			requestLocation();
		}
		setIsCreatorOpen(true);
	};

	const handleCloseCreator = () => {
		setIsCreatorOpen(false);
	};

	const handleIssueCreated = () => {
		// Refresh the page to show new issue
		router.refresh();
		setIsCreatorOpen(false);
	};

	return (
		<>
			<FloatingAddButton onClick={handleOpenCreator} />
			{coords && (
				<IssueCreator
					isOpen={isCreatorOpen}
					coords={coords}
					onClose={handleCloseCreator}
					onSubmit={handleIssueCreated}
				/>
			)}
		</>
	);
};
