'use client';

import { useRef, useState, useEffect } from 'react';

import { MapView } from '@/modules/issue/components/map-view';
import { FloatingAddButton } from '@/components/buttons/floating-add-button';
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
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const checkMobile = () => setIsMobile(window.innerWidth < 768);
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const handleIssueCreated = () => {
		filters.refetch();
	};

	const handleOpenCreator = () => {
		if (openCreatorRef.current) {
			openCreatorRef.current();
		}
	};

	return (
		<>
			{/* Mobile: Filters above map - same behavior as list page */}
			{isMobile && (
				<div>
					<IssueFilters {...filters} />
				</div>
			)}

			{/* Map container */}
			<div className="w-full h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] min-h-[500px] flex relative md:rounded-xl overflow-hidden md:shadow-lg md:border md:border-orange-200/50 bg-linear-to-br from-orange-50/30 via-amber-50/20 to-orange-50/30">
				{/* Subtle gradient overlay for visual depth */}
				<div className="absolute inset-0 bg-linear-to-br from-orange-50/10 via-transparent to-amber-50/10 pointer-events-none z-10" />
				
				{/* Desktop: Sidebar with filters */}
				{!isMobile && (
					<div className="z-20">
						<SlidingSidebar>
							<IssueFilters {...filters} />
						</SlidingSidebar>
					</div>
				)}

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
		</>
	);
};
