'use client';

import { useRef, useState } from 'react';

import { MapView } from '@/modules/issue/components/map-view';
import { FloatingAddButton } from '@/components/floating-add-button';
import { type Issue } from '@/modules/issue/schema';
import { useIssueFilters } from '@/hooks/useIssueFilters';
import { IssueFilters } from '@/modules/issue/components/issue-filters';
import { SlidingSidebar } from '@/components/page-modifiers/sliding-sidebar';

type MapPageClientProps = {
	initialIssues: Issue[];
};

export const MapPageClient = ({ initialIssues }: MapPageClientProps) => {
	const filters = useIssueFilters(initialIssues);
	const openCreatorRef = useRef<(() => void) | null>(null);
	const [isCreatorOpen, setIsCreatorOpen] = useState(false);

	const handleIssueCreated = () => {
		filters.refetch();
	};

	const handleOpenCreator = () => {
		if (openCreatorRef.current) {
			openCreatorRef.current();
		}
	};

	return (
		<div className="w-full h-full flex relative">
			<div className="z-20">
				<SlidingSidebar>
					<IssueFilters {...filters} />
				</SlidingSidebar>
			</div>

			<div className="flex-1 h-full relative">
				<MapView
					issues={filters.filteredIssues}
					onIssueCreated={handleIssueCreated}
					onOpenCreatorRef={openCreatorRef}
					onCreatorOpenChange={setIsCreatorOpen}
				/>
				{!isCreatorOpen && <FloatingAddButton onClick={handleOpenCreator} />}
			</div>
		</div>
	);
};
