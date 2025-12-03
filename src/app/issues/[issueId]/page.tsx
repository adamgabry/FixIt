'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { LatLng } from 'leaflet';
import { useParams } from 'next/navigation';

import { cn } from '@/lib/cn';
import { EditButton } from '@/components/edit-button';
import { DeleteButton } from '@/components/delete-button';
import { Input } from '@/components/input';
import { Button } from '@/components/button';

const MapComponent = dynamic(() => import('@/components/map'), {
	ssr: false
});

const IssuesDetailPage = () => {
	const { issueId: _issueId } = useParams<{ issueId: string }>();
	const [isEditing, setIsEditing] = useState(false);
	const [initialMarkers, setInitialMarkers] = useState<LatLng[]>([]);
	const [isMapReady, setIsMapReady] = useState(false);

	useEffect(() => {
		// Dynamically import LatLng only on the client side
		if (typeof window !== 'undefined') {
			import('leaflet').then(L => {
				setInitialMarkers([new L.LatLng(48.1486, 17.1077)]);
				setIsMapReady(true);
			});
		}
	}, []);

	return (
		<div className="flex flex-col md:flex-row min-h-screen w-full">
			{/* Map Section - First on mobile, right side on desktop */}
			<div className="flex flex-col w-full md:w-1/2 order-1 md:order-2">
				{/* Header/Toolbar */}
				<div className="border-b p-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<EditButton onClick={() => setIsEditing(!isEditing)} />
						<DeleteButton />
						<div className="w-8 h-8 bg-gray-300 rounded" />
						<span className="text-sm text-gray-500">xxx</span>
					</div>
				</div>

				{/* Location Name */}
				<div className="p-4 border-b">
					<span className="text-sm font-medium">Location name: xxx</span>
				</div>

				{/* Map Component */}
				<div className="relative w-full h-[400px] md:h-[500px] lg:h-[500px] p-4 md:p-6">
					{isMapReady ? (
						<MapComponent
							center={[48.1486, 17.1077]} // TODO: Get location from the backend
							zoom={20}
							style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
							initialMarkers={initialMarkers} // TODO: Get markers from the backend
							canCreateMarker={false}
						/>
					) : (
						<div className="flex items-center justify-center h-full">
							<span className="text-sm text-gray-500">Loading map...</span>
						</div>
					)}
				</div>
			</div>

			{/* Form Fields Section - Second on mobile, left side on desktop */}
			<div className="flex flex-col gap-4 p-6 w-full md:w-1/2 overflow-y-auto lg:max-h-screen order-2 md:order-1">
				{/* Title */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Title</label>
					{isEditing ? (
						// TODO: Change onChange to update the title
						<Input
							value="Broken Traffic Light at Main St"
							onChange={e => console.log(e.target.value)}
						/>
					) : (
						<div className="px-3 py-2 rounded-md border border-input bg-background text-sm">
							Broken Traffic Light at Main St
						</div>
					)}
				</div>

				{/* State Selector */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">State</label>
					<select
						// TODO: Change value to the state
						value="OPEN"
						// TODO: Change onChange to update the state
						onChange={e => console.log(e.target.value)}
						disabled={!isEditing}
						className={cn(
							'border-input bg-background ring-offset-background',
							'flex h-10 w-full rounded-md border px-3 py-2 text-sm',
							'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
							'focus-visible:outline-hidden',
							!isEditing && 'appearance-none'
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
					{isEditing ? (
						// TODO: Change onChange to update the type
						<Input
							value="Traffic Light"
							onChange={e => console.log(e.target.value)}
						/>
					) : (
						<div className="px-3 py-2 rounded-md border border-input bg-background text-sm">
							Traffic Light
						</div>
					)}
				</div>

				{/* Reported by */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Reported by</label>
					{isEditing ? (
						// TODO: Change onChange to update the reported by
						<Input
							value="John Doe"
							onChange={e => console.log(e.target.value)}
						/>
					) : (
						<div className="px-3 py-2 rounded-md border border-input bg-background text-sm">
							John Doe
						</div>
					)}
				</div>

				{/* Description */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium">Description</label>
					<textarea
						// TODO: Change value to the description
						value="The traffic light is not working properly."
						readOnly={!isEditing}
						disabled={!isEditing}
						className={cn(
							'border-input bg-background ring-offset-background',
							'flex min-h-[120px] w-full rounded-md border px-3 py-2 text-sm',
							'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
							'focus-visible:outline-hidden resize-none'
						)}
					/>
				</div>

				{/* Image Placeholders */}
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

				{/* Bottom Button */}
				{isEditing && (
					<div className="mt-auto pt-4">
						{/* TODO: Change onClick to submit the form */}
						<Button
							className="w-full h-12 rounded-lg"
							onClick={() => console.log('Submit')}
						>
							Submit
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default IssuesDetailPage;
