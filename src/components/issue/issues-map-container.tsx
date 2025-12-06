'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import { type Issue } from '@/modules/issue/schema';
import { IssueMarker } from '@/components/issue/issue-marker';
import { LocationButton } from '@/components/location-button';

// Fix for default marker icon in Next.js
if (typeof window !== 'undefined') {
	delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
		._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
		iconRetinaUrl:
			'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
		shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
	});
}

type IssuesMapContainerProps = {
	issues: Issue[];
	center?: [number, number];
	zoom?: number;
};

export const IssuesMapContainer = ({
	issues,
	center = [48.1486, 17.1077], // Default: Bratislava
	zoom = 13
}: IssuesMapContainerProps) => (
	<MapContainer
		center={center}
		zoom={zoom}
		style={{ height: '100%', width: '100%' }}
		className="z-0"
	>
		<TileLayer
			attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
			url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
		/>
		<LocationButton />
		{issues.map(issue => (
			<IssueMarker
				key={issue.id}
				issue={issue}
				position={[issue.latitude, issue.longitude]}
			/>
		))}
	</MapContainer>
);
