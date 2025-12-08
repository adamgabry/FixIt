'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { LatLng } from 'leaflet';
import { uploadBytes } from 'firebase/storage';
import { getDownloadURL, ref } from '@firebase/storage';
import { v4 } from 'uuid';

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
import { deleteIssueAction, updateIssueAction } from '@/modules/issue/actions';
import { storage } from '@/firebase';
import { ImageUpload } from '@/components/image-upload';
import { IssueImagesList } from '@/modules/issue/components/issue-images-list';
import { type IssuePicture } from '@/modules/issuePicture/schema';

const MapComponent = dynamic(() => import('@/components/map'), {
	ssr: false
});

type IssueDetailViewProps = {
	issue: Issue;
	initialEditMode?: boolean;
};

const IssueDetailView = ({
	issue: initialIssue,
	initialEditMode = false
}: IssueDetailViewProps) => {
	const router = useRouter();
	const [issue, setIssue] = useState(initialIssue);
	const [isEditing, setIsEditing] = useState(initialEditMode);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	const [initialMarkers, setInitialMarkers] = useState<LatLng[]>([]);
	const [isMapReady, setIsMapReady] = useState(false);
	const [address, setAddress] = useState<Address | null>(null);
	const [isLoadingAddress, setIsLoadingAddress] = useState(false);

	// Image management
	const [existingImages, setExistingImages] = useState<IssuePicture[]>(
		issue.pictureUrls?.map(url => ({ url, issue })) || []
	);
	const [newImages, setNewImages] = useState<File[]>([]);
	const [_deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

	const lat = issue.latitude;
	const lng = issue.longitude;

	// Sync local state when initialIssue prop changes (after save/refresh)
	useEffect(() => {
		setIssue(initialIssue);
		setExistingImages(
			initialIssue.pictureUrls?.map(url => ({ url, issue: initialIssue })) || []
		);
		setNewImages([]);
		setDeletedImageUrls([]);
	}, [initialIssue]);

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
		let timeoutId: NodeJS.Timeout;

		const fetchAddress = async () => {
			setIsLoadingAddress(true);
			try {
				// Add a small delay to respect Nominatim rate limit (1 req/sec)
				await new Promise(resolve => {
					timeoutId = setTimeout(resolve, 1100);
				});
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
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	}, [lat, lng]);

	// Handle marker drag end
	const handleMarkerDragEnd = (newLat: number, newLng: number) => {
		setIssue({
			...issue,
			latitude: newLat,
			longitude: newLng
		});
		// Update markers for map
		if (typeof window !== 'undefined') {
			import('leaflet').then(L => {
				setInitialMarkers([new L.LatLng(newLat, newLng)]);
			});
		}
	};

	const handleDelete = async () => {
		setIsDeleting(true);
		try {
			await deleteIssueAction(issue.id);
			// Close dialog
			setShowDeleteConfirm(false);
			// Navigate away - use replace to avoid back button issues
			router.replace('/');
		} catch (error) {
			console.error('Error deleting issue:', error);
			alert(
				`Failed to delete issue: ${error instanceof Error ? error.message : 'Unknown error'}`
			);
			setIsDeleting(false);
			setShowDeleteConfirm(false);
		}
	};

	const handleSave = async () => {
		setIsSaving(true);
		setSaveError(null);

		try {
			if (!issue.title.trim()) {
				setSaveError('Title is required');
				setIsSaving(false);
				return;
			}

			if (!issue.description?.trim()) {
				setSaveError('Description is required');
				setIsSaving(false);
				return;
			}

			const uploadedImageUrls: string[] = await Promise.all(
				newImages.map(async file => {
					const path = `images/${file.name}-${v4()}`;
					await uploadBytes(ref(storage, path), file);
					return await getDownloadURL(ref(storage, path));
				})
			);

			const picturesToUpdate: string[] = [
				...existingImages.map(img => img.url),
				...uploadedImageUrls
			];

			const updateData = {
				title: issue.title.trim(),
				description: issue.description.trim(),
				latitude: issue.latitude,
				longitude: issue.longitude,
				type: issue.type,
				status: issue.status,
				reporterId: issue.reporter.id,
				pictures: picturesToUpdate
			};

			await updateIssueAction(issue.id, updateData);

			setIsEditing(false);
			router.refresh();
		} catch (error) {
			console.error('Error saving issue:', error);
			setSaveError(
				error instanceof Error ? error.message : 'Failed to save changes'
			);
		} finally {
			setIsSaving(false);
		}
	};

	const handleCancel = () => {
		setIssue(initialIssue);
		setExistingImages(
			initialIssue.pictureUrls?.map(url => ({ url, issue: initialIssue })) || []
		);
		setNewImages([]);
		setDeletedImageUrls([]);
		setIsEditing(false);
		setSaveError(null);
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
				<div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
					{/* Header Section */}
					<div className="mb-6">
						<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 p-4 sm:p-6">
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
								<div className="flex-1 w-full">
									{isEditing ? (
										<Input
											value={issue.title}
											onChange={e =>
												setIssue({ ...issue, title: e.target.value })
											}
											className="text-2xl sm:text-3xl font-bold mb-2 bg-white/80 backdrop-blur-sm border-orange-200 h-auto py-2 px-3 border-2"
											placeholder="Issue title"
										/>
									) : (
										<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
											{issue.title}
										</h1>
									)}
									<div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
										<span className="flex items-center gap-1.5">
											<span className="font-medium">Reported by:</span>
											<span className="text-gray-800">
												{issue.reporter?.name ?? 'Unknown'}
											</span>
										</span>
										<span className="text-gray-400">•</span>
										<span className="flex items-center gap-1.5">
											<span className="font-medium">Location:</span>
											{isLoadingAddress ? (
												<span className="text-gray-500 italic">
													Loading address...
												</span>
											) : address ? (
												<span
													className="text-gray-800"
													title={`${lat.toFixed(6)}, ${lng.toFixed(6)}`}
												>
													{address.street && address.city
														? `${address.street}, ${address.city}${address.country ? `, ${address.country}` : ''}`
														: address.displayName ||
															`${lat.toFixed(6)}, ${lng.toFixed(6)}`}
												</span>
											) : (
												<span className="text-gray-800">
													{lat.toFixed(6)}, {lng.toFixed(6)}
												</span>
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
										<>
											<MapComponent
												center={[lat, lng]}
												zoom={20}
												style={{ height: '100%', width: '100%' }}
												initialMarkers={initialMarkers}
												canCreateMarker={false}
												draggableMarker={isEditing}
												onMarkerDragEnd={handleMarkerDragEnd}
											/>
											{isEditing && (
												<div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-[1000] pointer-events-none">
													<p className="text-sm text-gray-700 text-center font-medium">
														Drag the marker to change the location
													</p>
												</div>
											)}
										</>
									) : (
										<div className="flex items-center justify-center h-full bg-gradient-to-br from-orange-100 to-amber-100">
											<div className="text-center">
												<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2" />
												<span className="text-sm text-gray-600">
													Loading map...
												</span>
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
											setIssue({
												...issue,
												status: e.target.value as Issue['status']
											})
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
													.map(
														word => word.charAt(0).toUpperCase() + word.slice(1)
													)
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
											setIssue({
												...issue,
												type: e.target.value as Issue['type']
											})
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
													.map(
														word => word.charAt(0).toUpperCase() + word.slice(1)
													)
													.join(' ')}
											</option>
										))}
									</select>
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
										onChange={e =>
											setIssue({ ...issue, description: e.target.value })
										}
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

									<IssueImagesList
										images={existingImages}
										setImagesAction={setExistingImages}
										isEditing={isEditing}
									/>

									{isEditing && (
										<div className="mt-5">
											<ImageUpload
												value={newImages}
												onChangeAction={setNewImages}
												label="Upload new images"
											/>
										</div>
									)}
								</div>

								{isEditing && (
									<div className="pt-4 border-t border-orange-200/50 space-y-3">
										{saveError && (
											<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
												{saveError}
											</div>
										)}
										<div className="flex gap-3">
											<Button
												variant="outline"
												className="flex-1 h-12 rounded-lg border-orange-200 hover:bg-orange-50 transition-all duration-200"
												onClick={handleCancel}
												disabled={isSaving}
											>
												Cancel
											</Button>
											<Button
												className="flex-1 h-12 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
												onClick={handleSave}
												disabled={isSaving}
											>
												{isSaving ? (
													<span className="flex items-center justify-center gap-2">
														<svg
															className="animate-spin h-5 w-5"
															xmlns="http://www.w3.org/2000/svg"
															fill="none"
															viewBox="0 0 24 24"
														>
															<circle
																className="opacity-25"
																cx="12"
																cy="12"
																r="10"
																stroke="currentColor"
																strokeWidth="4"
															/>
															<path
																className="opacity-75"
																fill="currentColor"
																d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
															/>
														</svg>
														Saving...
													</span>
												) : (
													'Save Changes'
												)}
											</Button>
										</div>
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
