'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapView } from '@/modules/issue/components/map-view';
import { FloatingAddButton } from '@/components/floating-add-button';
import { type Issue } from '@/modules/issue/schema';

type MapPageClientProps = {
	issues: Issue[];
};

export const MapPageClient = ({ issues }: MapPageClientProps) => {
	const router = useRouter();
	const openCreatorRef = useRef<(() => void) | null>(null);
	const [isCreatorOpen, setIsCreatorOpen] = useState(false);

	const handleIssueCreated = () => {
		// Refresh the page to show new issue
		router.refresh();
	};

	const handleOpenCreator = () => {
		if (openCreatorRef.current) {
			openCreatorRef.current();
		}
	};

	return (
		<>
			<MapView
				issues={issues}
				onIssueCreated={handleIssueCreated}
				onOpenCreatorRef={openCreatorRef}
				onCreatorOpenChange={setIsCreatorOpen}
			/>
			{!isCreatorOpen && <FloatingAddButton onClick={handleOpenCreator} />}
		</>
	);
};

