'use client';

import dynamic from 'next/dynamic';

import { type Issue } from '@/modules/issue/schema';

// Dynamic import for Leaflet map
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
};

export const MapView: React.FC<MapViewProps> = ({ issues }) => (
	<div className="flex-1 relative">
		<IssuesMapContainer issues={issues} />
	</div>
);
