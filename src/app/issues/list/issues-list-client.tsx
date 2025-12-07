'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FloatingAddButton } from '@/components/floating-add-button';
import { IssueCreator } from '@/components/issue/issue-create';

export const IssuesListClient = () => {
	const router = useRouter();
	const [isCreatorOpen, setIsCreatorOpen] = useState(false);
	
	// Default coordinates: Bratislava
	const defaultCoords = { lat: 48.1486, lng: 17.1077 };

	const handleOpenCreator = () => {
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
			<IssueCreator
				isOpen={isCreatorOpen}
				coords={defaultCoords}
				onClose={handleCloseCreator}
				onSubmit={handleIssueCreated}
			/>
		</>
	);
};

