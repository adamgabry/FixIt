import { MapView } from '@/modules/issue/components/map-view';
import { FloatingAddButton } from '@/components/floating-add-button';
import { getIssuesFacade } from '@/modules/issue/facade';

import { MapPageClient } from './map-page-client';

const Home = async () => {
	const issues = await getIssuesFacade();

	return (
		<div className="w-full h-[calc(100vh-5rem)] min-h-[600px] rounded-xl overflow-hidden shadow-lg border border-orange-200/50 bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-orange-50/30 relative">
			{/* Subtle gradient overlay for visual depth - matches navbar theme */}
			<div className="absolute inset-0 bg-gradient-to-br from-orange-50/10 via-transparent to-amber-50/10 pointer-events-none z-10" />
			<MapPageClient issues={issues} />
		</div>
	);
};

export default Home;
