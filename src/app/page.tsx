// src/app/page.tsx
import { MapView } from '@/modules/issue/components/map-view';
import { FloatingAddButton } from '@/components/floating-add-button';
import { getIssuesFacade } from '@/modules/issue/facade';

import { MapPageClient } from './map-page-client';

const Home = async () => {
	const issues = await getIssuesFacade();

	return (
		<div className="flex h-[calc(100vh-80px)] -mx-4 -my-8 md:-mx-8">
			<MapPageClient issues={issues} />
		</div>
	);
};

export default Home;
