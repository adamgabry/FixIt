'use client';

import { useState, useEffect } from 'react';

import { FloatingAddButton } from '@/components/buttons/floating-add-button';
import { IssueCreator } from '@/components/issue/issue-create';
import { useLocation } from '@/lib/use-location';
import { useIssueFilters } from '@/hooks/useIssueFilters';
import type { Issue } from '@/modules/issue/schema';
import { IssueFilters } from '@/modules/issue/components/issue-filters';
import { IssueList } from '@/modules/issue/components/issue-list';

type IssueListClientProps = {
	initialIssues: Issue[];
	currentUserId: string | null;
};

export const IssuesListClient = ({
	initialIssues,
	currentUserId
}: IssueListClientProps) => {
	const filters = useIssueFilters(initialIssues);
	const [isCreatorOpen, setIsCreatorOpen] = useState(false);

	// Default coordinates: Brno (fallback)
	const defaultCoords = { lat: 49.1951, lng: 16.6068 };

	const { coords: userCoords, requestLocation } = useLocation();

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
		filters.refetch();
		setIsCreatorOpen(false);
	};

	return (
		<>
			<IssueFilters {...filters} />
			{filters.isLoading ? (
				<p>Loading...</p>
			) : (
				<IssueList
					issues={filters.filteredIssues}
					currentUserId={currentUserId}
				/>
			)}
			{currentUserId && <FloatingAddButton onClickAction={handleOpenCreator} />}
			{coords && (
				<IssueCreator
					isOpen={isCreatorOpen}
					coords={coords}
					onCloseAction={handleCloseCreator}
					onSubmitAction={handleIssueCreated}
				/>
			)}
		</>
	);
};
