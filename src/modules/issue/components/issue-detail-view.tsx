'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LatLng } from 'leaflet';

import { cn } from '@/lib/cn';
import { reverseGeocode, type Address } from '@/lib/geocoding';
import { EditButton } from '@/components/edit-button';
import { DeleteButton } from '@/components/delete-button';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import {
	type Issue,
	ISSUE_STATUS_VALUES,
	ISSUE_TYPE_VALUES
} from '@/modules/issue/schema';
import { deleteIssueAction } from '@/modules/issue/actions';

const MapComponent = dynamic(() => import('@/components/map'), {
	ssr: false
});

type IssueDetailViewProps = {
	issue: Issue;
};

const IssueDetailView = ({ issue: initialIssue }: IssueDetailViewProps) => {
	const router = useRouter();
	const [issue, setIssue] = useState(initialIssue);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const [initialMarkers, setInitialMarkers] = useState<LatLng[]>([]);
	const [isMapReady, setIsMapReady] = useState(false);
	const [address, setAddress] = useState<Address | null>(null);
	const [isLoadingAddress, setIsLoadingAddress] = useState(false);

	const lat = issue.latitude;
	const lng = issue.longitude;

	// Initialize map markers
	useEffect(() => {
		if (typeof window !== 'undefined') {
			import('leaflet').then(L => {
				setInitialMarkers([new L.LatLng(lat, lng)]);
				setIsMapReady(true);
			});
		}
	}, [lat, lng]);

	// Fetch address when coordinates change
	useEffect(() => {
		let isMounted = true;

		const fetchAddress = async () => {
			setIsLoadingAddress(true);
			try {
				// Add a small delay to respect Nominatim rate limit (1 req/sec)
				await new Promise(resolve => setTimeout(resolve, 1100));
				const result = await reverseGeocode(lat, lng);
				if (isMounted) {
					setAddress(result);
				}
			} catch (error) {
				console.error('Failed to fetch address:', error);
				if (isMounted) {
					setAddress(null);
				}
			} finally {
				if (isMounted) {
					setIsLoadingAddress(false);
				}
			}
		};

		fetchAddress();

		return () => {
			isMounted = false;
		};
	}, [lat, lng]);

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteIssueAction(issue.id);
			router.replace('/');
			router.refresh();
		} catch (error) {
			console.error('Error deleting issue:', error);
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	return (
		<>
			<DeleteConfirmationDialog
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDelete}
				isDeleting={isDeleting}
			/>

			{/* Full viewport background */}
			<div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 -z-10" />
			{/* Content */}
			<div className="relative min-h-screen z-10">
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
					{/* Header Section */}
					<div className="mb-6">
						<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 p-4 sm:p-6">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
								<div className="flex-1">
									<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
										{issue.title}
									</h1>
									<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
										<span className="flex items-center gap-1.5">
											<span className="font-medium">Reported by:</span>
											<span className="text-gray-800">{issue.reporter?.name ?? 'Unknown'}</span>
										</span>
										<span className="text-gray-400">•</span>
										<span className="flex items-center gap-1.5">
											<span className="font-medium">Location:</span>
											{isLoadingAddress ? (
												<span className="text-gray-500 italic">Loading address...</span>
											) : address ? (
												<span className="text-gray-800" title={`${lat.toFixed(6)}, ${lng.toFixed(6)}`}>
													{address.street && address.city
														? `${address.street}, ${address.city}${address.country ? `, ${address.country}` : ''}`
														: address.displayName || `${lat.toFixed(6)}, ${lng.toFixed(6)}`}
												</span>
											) : (
												<span className="text-gray-800">{lat.toFixed(6)}, {lng.toFixed(6)}</span>
											)}
										</span>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<EditButton onClick={() => setIsEditing(!isEditing)} />
									<DeleteButton
										onClick={() => setShowDeleteConfirm(true)}
										disabled={isDeleting}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* MAP SECTION */}
						<div className="order-1 lg:order-1">
							<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 overflow-hidden">
								<div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px]">
									{isMapReady ? (
										<MapComponent
											center={[lat, lng]}
											zoom={20}
											style={{ height: '100%', width: '100%' }}
											initialMarkers={initialMarkers}
											canCreateMarker={false}
										/>
									) : (
										<div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-100 to-amber-100">
											<div className="text-center">
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
												<span className="text-sm text-gray-600">Loading map...</span>
											</div>
										</div>
									)}
								</div>
							</div>
						</div>

						{/* DETAILS SECTION */}
						<div className="order-2 lg:order-2">
							<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 p-4 sm:p-6 space-y-6">
								{/* Status */}
								<div className="flex flex-col gap-2">
									<label className="text-sm font-semibold text-gray-700">
										Status
									</label>
									<select
										value={issue.status}
										onChange={e =>
											setIssue({ ...issue, status: e.target.value as Issue['status'] })
										}
										disabled={!isEditing}
										className={cn(
											'border border-orange-200 bg-white/80 backdrop-blur-sm',
											'flex h-10 w-full rounded-lg px-3 py-2 text-sm',
											'transition-all duration-200',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
											'disabled:opacity-50 disabled:cursor-not-allowed',
											!isEditing && 'cursor-default'
										)}
									>
										{ISSUE_STATUS_VALUES.map(status => (
											<option key={status} value={status}>
												{status
													.split('_')
													.map(word => word.charAt(0).toUpperCase() + word.slice(1))
													.join(' ')}
											</option>
										))}
									</select>
								</div>

								{/* Type */}
								<div className="flex flex-col gap-2">
									<label className="text-sm font-semibold text-gray-700">
										Type
									</label>
									<select
										value={issue.type}
										onChange={e =>
											setIssue({ ...issue, type: e.target.value as Issue['type'] })
										}
										disabled={!isEditing}
										className={cn(
											'border border-orange-200 bg-white/80 backdrop-blur-sm',
											'flex h-10 w-full rounded-lg px-3 py-2 text-sm',
											'transition-all duration-200',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
											'disabled:opacity-50 disabled:cursor-not-allowed',
											!isEditing && 'cursor-default'
										)}
									>
										{ISSUE_TYPE_VALUES.map(type => (
											<option key={type} value={type}>
												{type
													.split('_')
													.map(word => word.charAt(0).toUpperCase() + word.slice(1))
													.join(' ')}
											</option>
										))}
									</select>
								</div>

								{/* Reporter */}
								<div className="flex flex-col gap-2">
									<label className="text-sm font-semibold text-gray-700">
										Reported by
									</label>
									{isEditing ? (
										<Input
											value={issue.reporter.name}
											onChange={e => console.log(e.target.value)}
											className="bg-white/80 backdrop-blur-sm border-orange-200"
										/>
									) : (
										<div className="px-3 py-2 rounded-lg border border-orange-200 bg-white/80 backdrop-blur-sm text-sm text-gray-800">
											{issue.reporter.name}
										</div>
									)}
								</div>

								{/* Description */}
								<div className="flex flex-col gap-2">
									<label className="text-sm font-semibold text-gray-700">
										Description
									</label>
									<textarea
										value={issue.description || ''}
										readOnly={!isEditing}
										disabled={!isEditing}
										onChange={e => setIssue({ ...issue, description: e.target.value })}
										className={cn(
											'border border-orange-200 bg-white/80 backdrop-blur-sm',
											'flex min-h-[120px] w-full rounded-lg px-3 py-2 text-sm resize-none',
											'transition-all duration-200',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
											'disabled:opacity-50 disabled:cursor-not-allowed',
											!isEditing && 'cursor-default'
										)}
									/>
								</div>

								{/* Images */}
								<div className="flex flex-col gap-2">
									<label className="text-sm font-semibold text-gray-700">
										Images
									</label>
									<div className="grid grid-cols-2 gap-3">
										<div className="aspect-square border-2 border-dashed border-orange-300/60 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-50/50 to-amber-50/50 backdrop-blur-sm transition-all duration-200 hover:border-orange-400/80 hover:bg-gradient-to-br hover:from-orange-100/50 hover:to-amber-100/50">
											<span className="text-xs text-gray-500">Image 1</span>
										</div>
										<div className="aspect-square border-2 border-dashed border-orange-300/60 rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-50/50 to-amber-50/50 backdrop-blur-sm transition-all duration-200 hover:border-orange-400/80 hover:bg-gradient-to-br hover:from-orange-100/50 hover:to-amber-100/50">
											<span className="text-xs text-gray-500">Image 2</span>
										</div>
									</div>
									<div className="w-full border-2 border-dashed border-orange-300/60 rounded-lg h-32 flex items-center justify-center bg-gradient-to-br from-orange-50/50 to-amber-50/50 backdrop-blur-sm transition-all duration-200 hover:border-orange-400/80 hover:bg-gradient-to-br hover:from-orange-100/50 hover:to-amber-100/50">
										<span className="text-xs text-gray-500">Image 3</span>
									</div>
								</div>

								{isEditing && (
									<div className="pt-4 border-t border-orange-200/50">
										<Button
											className="w-full h-12 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200"
											onClick={() => console.log('Submit', issue)}
										>
											Save Changes
										</Button>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default IssueDetailView;
