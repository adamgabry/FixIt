// src/app/page.tsx
import { MapView } from '@/modules/issue/components/map-view';
import { FloatingAddButton } from '@/components/floating-add-button';
import { getIssuesFacade } from '@/modules/issue/facade';

const Home = async () => {
	const issues = await getIssuesFacade();

	return (
		<div className="flex h-[calc(100vh-80px)] -mx-4 -my-8 md:-mx-8">
			{/*
			<SidebarFilter
				filters={filters}
				onFiltersChangeAction={setFilters}
				issueCount={issues.length}
				filteredCount={filteredIssues.length}
			/>
			*/}
			<MapView issues={issues} />
			<FloatingAddButton />
		</div>
	);
};

export default Home;
