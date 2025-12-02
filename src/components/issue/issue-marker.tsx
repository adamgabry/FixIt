'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { type Issue, IssueType } from '@/modules/issue/schema';
import {
	ISSUE_TYPE_COLORS,
	ISSUE_TYPE_LABELS,
	ISSUE_STATUS_LABELS,
	createColoredMarkerSvg
} from '@/lib/issue-utils';
import { Button } from '@/components/button';

type IssueMarkerProps = {
	issue: Issue;
	position: [number, number];
};

/**
 * Create a custom Leaflet icon for an issue type
 */
const createIssueIcon = (type: IssueType): L.Icon => {
	const color = ISSUE_TYPE_COLORS[type];
	return L.icon({
		iconUrl: createColoredMarkerSvg(color),
		iconSize: [24, 36],
		iconAnchor: [12, 36],
		popupAnchor: [0, -36]
	});
};

export const IssueMarker = ({ issue, position }: IssueMarkerProps) => {
	const router = useRouter();
	const icon = createIssueIcon(issue.type as IssueType);

	const handleViewDetails = () => {
		router.push(`/issues/${issue.id}`);
	};

	return (
		<Marker position={position} icon={icon}>
			<Popup>
				<div className="min-w-[200px] max-w-[280px]">
					<h3 className="font-semibold text-sm mb-1 text-gray-900">
						{issue.title}
					</h3>
					<div className="flex items-center gap-2 mb-2">
						<span
							className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
							style={{
								backgroundColor:
									ISSUE_TYPE_COLORS[issue.type as IssueType]
							}}
						>
							{ISSUE_TYPE_LABELS[issue.type as IssueType]}
						</span>
						<span className="text-xs text-gray-500">
							{ISSUE_STATUS_LABELS[issue.status as keyof typeof ISSUE_STATUS_LABELS]}
						</span>
					</div>
					<p className="text-xs text-gray-600 mb-2 line-clamp-2">
						{issue.description}
					</p>
					<Button
						size="sm"
						className="w-full text-xs"
						onClick={handleViewDetails}
					>
						View Details
					</Button>
				</div>
			</Popup>
		</Marker>
	);
};
