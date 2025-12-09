'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { type Issue, type IssueType, type IssueStatus } from '@/modules/issue/schema';
import {
	ISSUE_TYPE_COLORS,
	createColoredMarkerSvg
} from '@/lib/issue-utils';
import { IssueStatusBadge } from '@/modules/issue/components/issue-status-badge';
import { IssueTypeBadge } from '@/modules/issue/components/issue-type-badge';
import { Button } from '@/components/buttons/button';

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
			<Popup className="custom-popup">
				<div className="min-w-[280px] max-w-[320px] bg-white rounded-xl overflow-hidden shadow-lg border border-orange-200/50">
					{/* Image Section */}
					<div className="relative w-full h-32">
						{issue.pictureUrls[0] ? (
							<Image
								src={issue.pictureUrls[0]}
								alt={issue.title}
								fill
								className="object-cover"
								unoptimized
							/>
						) : (
							<div className="bg-linear-to-br from-orange-100 via-amber-50 to-orange-100 w-full h-full flex items-center justify-center text-gray-400 text-xs">
								No image
							</div>
						)}
					</div>

					{/* Content Section */}
					<div className="p-3">
						<h3 className="font-semibold text-base mb-2 text-gray-900 line-clamp-2">
							{issue.title}
						</h3>
						<div className="flex flex-wrap gap-2 mb-3">
							<IssueStatusBadge status={issue.status as IssueStatus} />
							<IssueTypeBadge type={issue.type as IssueType} />
						</div>
						<Button
							variant="default"
							size="sm"
							animation="scale"
							onClick={handleViewDetails}
							className="w-full"
						>
							View Details
							<ArrowRight className="w-4 h-4 ml-1" />
						</Button>
					</div>
				</div>
			</Popup>
		</Marker>
	);
};
