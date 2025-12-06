'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import type { LatLng } from 'leaflet';

import { cn } from '@/lib/cn';
import { EditButton } from '@/components/edit-button';
import { DeleteButton } from '@/components/delete-button';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { type Issue } from '@/modules/issue/schema';

const MapComponent = dynamic(() => import('@/components/map'), {
	ssr: false
});

type IssueDetailViewProps = {
	issue: Issue;
};

const IssueDetailView = ({ issue: initialIssue }: IssueDetailViewProps) => {
	const [issue, setIssue] = useState(initialIssue);
	const [isEditing, setIsEditing] = useState(false);

	const [initialMarkers, setInitialMarkers] = useState<LatLng[]>([]);
	const [isMapReady, setIsMapReady] = useState(false);

	useEffect(() => {
		if (typeof window !== 'undefined') {
			import('leaflet').then(L => {
				const lat = issue.latitude;
				const lng = issue.longitude;

				setInitialMarkers([new L.LatLng(lat, lng)]);
				setIsMapReady(true);
			});
		}
	}, [issue.latitude, issue.longitude]);

	const lat = issue.latitude;
	const lng = issue.longitude;

	return (
		<div className="flex flex-col md:flex-row min-h-screen w-full">
			{/* MAP SECTION */}
			<div className="flex flex-col w-full md:w-1/2 order-1 md:order-2">
				<div className="border-b p-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<EditButton onClick={() => setIsEditing(!isEditing)} />
						<DeleteButton />
						<span className="text-sm text-gray-500">
							{issue.reporter?.name ?? 'Unknown'}
						</span>
					</div>
				</div>

				<div className="p-4 border-b">
					<span className="text-sm font-medium">
						Location: {lat}, {lng}
					</span>
				</div>

				<div className="relative w-full h-[400px] md:h-[500px] p-4 md:p-6">
					{isMapReady ? (
						<MapComponent
							center={[lat, lng]}
							zoom={20}
							style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
							initialMarkers={initialMarkers}
							canCreateMarker={false}
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<span className="text-sm text-gray-500">Loading map...</span>
						</div>
					)}
				</div>
			</div>

			{/* DETAILS SECTION */}
			<div className="flex flex-col gap-4 p-6 w-full md:w-1/2 overflow-y-auto lg:max-h-screen order-2 md:order-1">
				{/* Title */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Title</label>
					{isEditing ? (
						<Input
							value={issue.title}
							onChange={e => setIssue({ ...issue, title: e.target.value })}
						/>
					) : (
						<div className="px-3 py-2 rounded-md border bg-background text-sm">
							{issue.title}
						</div>
					)}
				</div>

				{/* Status */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Status</label>
					<select
						value={issue.status}
						onChange={e =>
							setIssue({ ...issue, status: e.target.value as Issue['status'] })
						}
						disabled={!isEditing}
						className={cn(
							'border bg-background flex h-10 w-full rounded-md px-3 py-2 text-sm'
						)}
					>
						<option value="OPEN">Open</option>
						<option value="IN_PROGRESS">In Progress</option>
						<option value="CLOSED">Closed</option>
					</select>
				</div>

				{/* Type */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Type</label>
					<Input
						value={issue.type}
						readOnly={!isEditing}
						onChange={e =>
							setIssue({ ...issue, type: e.target.value as Issue['type'] })
						}
					/>
				</div>

				{/* Reporter */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Reported by</label>
					{isEditing ? (
						<Input
							value={issue.reporter.name}
							onChange={e => console.log(e.target.value)}
						/>
					) : (
						<div className="px-3 py-2 rounded-md border bg-background text-sm">
							{issue.reporter.name}
						</div>
					)}
				</div>

				{/* Description */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Description</label>
					<textarea
						value={issue.description || ''}
						readOnly={!isEditing}
						disabled={!isEditing}
						onChange={e => setIssue({ ...issue, description: e.target.value })}
						className={cn(
							'border bg-background flex min-h-[120px] w-full rounded-md px-3 py-2 text-sm resize-none'
						)}
					/>
				</div>

				{/* Images */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Images</label>
					<div className="grid grid-cols-2 gap-2">
						<div className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
							<span className="text-xs text-gray-400">Image 1</span>
						</div>
						<div className="aspect-square border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50">
							<span className="text-xs text-gray-400">Image 2</span>
						</div>
					</div>
					<div className="w-full border-2 border-dashed border-gray-300 rounded-md h-32 flex items-center justify-center bg-gray-50">
						<span className="text-xs text-gray-400">Image 3</span>
					</div>
				</div>

				{isEditing && (
					<div className="mt-auto pt-4">
						<Button
							className="w-full h-12 rounded-lg"
							onClick={() => console.log('Submit', issue)}
						>
							Submit
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default IssueDetailView;
