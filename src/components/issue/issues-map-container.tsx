'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { type Issue } from '@/modules/issue/schema';
import { IssueMarker } from '@/components/issue/issue-marker';

// Fix for default marker icon in Next.js
if (typeof window !== 'undefined') {
	delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })
		._getIconUrl;
	L.Icon.Default.mergeOptions({
		iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
		iconRetinaUrl:
			'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
		shadowUrl:
			'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
	});
}

type IssuesMapContainerProps = {
	issues: Issue[];
	center?: [number, number];
	zoom?: number;
};

/**
 * Parse location string to coordinates
 * Expected format: "lat,lng" or just returns default if parsing fails
 */
const parseLocation = (
	location: string
): [number, number] | null => {
	try {
		const parts = location.split(',').map((s) => parseFloat(s.trim()));
		if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
			return [parts[0], parts[1]];
		}
	} catch {
		// Invalid format, return null
	}
	return null;
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
		{issues.map((issue) => {
			const position = parseLocation(issue.location);
			if (!position) return null;
			return (
				<IssueMarker key={issue.id} issue={issue} position={position} />
			);
		})}
	</MapContainer>
);
