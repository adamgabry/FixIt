'use client';

import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { LatLng } from 'leaflet';
import { uploadBytes } from 'firebase/storage';
import { getDownloadURL, ref } from '@firebase/storage';
import { v4 } from 'uuid';
import { Pencil, Trash2, Save, X } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useActionState, useTransition, useEffect as useReactEffect } from 'react';
import { toast } from 'sonner';

import { cn } from '@/lib/cn';
import { reverseGeocode, type Address } from '@/lib/geocoding';
import { Input } from '@/components/input';
import { Button } from '@/components/buttons/button';
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
import { IssueUpvoteButton } from '@/modules/issue/components/issue-upvote-button';
import { hasStaffPermissions, useSession } from '@/modules/auth/client';
import { type Role } from '@/modules/user/schema';
import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormSelect } from '@/components/form/form-select';
import { SubmitButton } from '@/components/form/submit-button';
import {
	type UpdateIssueFormSchema,
	updateIssueFormSchema
} from '@/modules/issue/components/update-issue-form/schema';

const MapComponent = dynamic(() => import('@/modules/map/map'), {
	ssr: false
});

type IssueDetailViewProps = {
	issue: Issue;
	currentUserId: string | null;
	currentUserRole: Role | null;
	initialEditMode?: boolean;
};

const IssueDetailView = ({
	issue: initialIssue,
	currentUserId,
	currentUserRole,
	initialEditMode = false
}: IssueDetailViewProps) => {
	const router = useRouter();
	const { data: session } = useSession();
	const [state, formAction] = useActionState(updateIssueAction, null);
	const [isPending, startTransition] = useTransition();
	const [issue, setIssue] = useState(initialIssue);
	const [isEditing, setIsEditing] = useState(initialEditMode);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

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

	// Form setup
	const form = useForm<UpdateIssueFormSchema>({
		resolver: zodResolver(updateIssueFormSchema),
		defaultValues: {
			title: initialIssue.title,
			description: initialIssue.description,
			type: initialIssue.type,
			status: initialIssue.status,
			latitude: initialIssue.latitude,
			longitude: initialIssue.longitude
		}
	});

	const lat = issue.latitude;
	const lng = issue.longitude;

	const resolvedUserId = session?.user?.id ?? currentUserId;
	const resolvedUserRole = session?.user?.role ?? currentUserRole ?? undefined;

	const hasStaffPermissionsFlag = hasStaffPermissions(resolvedUserRole);
	const isUsersIssue = resolvedUserId === issue.reporter.id;

	// Sync local state when initialIssue prop changes (after save/refresh)
	useEffect(() => {
		setIssue(initialIssue);
		setExistingImages(
			initialIssue.pictureUrls?.map(url => ({ url, issue: initialIssue })) || []
		);
		setNewImages([]);
		setDeletedImageUrls([]);
		form.reset({
			title: initialIssue.title,
			description: initialIssue.description,
			type: initialIssue.type,
			status: initialIssue.status,
			latitude: initialIssue.latitude,
			longitude: initialIssue.longitude
		});
	}, [initialIssue, form]);

	// Handle action state changes
	useReactEffect(() => {
		if (state?.error) {
			toast.error(state.error);
		} else if (state?.success && state.issue) {
			toast.success(`Issue "${state.issue.title}" updated!`);
			setIsEditing(false);
			router.refresh();
		}
	}, [state, router]);

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

	const handleMarkerDragEnd = (newLat: number, newLng: number) => {
		setIssue({
			...issue,
			latitude: newLat,
			longitude: newLng
		});
		form.setValue('latitude', newLat);
		form.setValue('longitude', newLng);
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
			setShowDeleteConfirm(false);
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

	const handleSave = form.handleSubmit(async values => {
		// Upload new images to Firebase first
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

		// Create FormData with all values
		const formData = new FormData();
		formData.append('id', String(issue.id));
		formData.append('title', values.title);
		formData.append('description', values.description);
		formData.append('type', values.type);
		formData.append('status', values.status);
		formData.append('latitude', String(values.latitude));
		formData.append('longitude', String(values.longitude));
		formData.append('reporterId', issue.reporter.id);

		// Append all picture URLs
		picturesToUpdate.forEach(url => {
			formData.append('pictures', url);
		});

		startTransition(() => {
			formAction(formData);
		});
	});

	const handleCancel = () => {
		setIssue(initialIssue);
		setExistingImages(
			initialIssue.pictureUrls?.map(url => ({ url, issue: initialIssue })) || []
		);
		setNewImages([]);
		setDeletedImageUrls([]);
		setIsEditing(false);
		form.reset({
			title: initialIssue.title,
			description: initialIssue.description,
			type: initialIssue.type,
			status: initialIssue.status,
			latitude: initialIssue.latitude,
			longitude: initialIssue.longitude
		});
	};

	return (
		<>
			<DeleteConfirmationDialog
				isOpen={showDeleteConfirm}
				onCloseAction={() => setShowDeleteConfirm(false)}
				onConfirmAction={handleDelete}
				isDeleting={isDeleting}
			/>

			<div className="fixed inset-0 bg-linear-to-br from-orange-50 via-amber-50 to-orange-50 -z-10" />
			<div className="relative min-h-screen z-10">
				<FormProvider {...form}>
					<div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-6">
						{/* Header Section */}
						<div className="mb-6">
							<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 p-4 sm:p-6">
								<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
									<div className="flex-1 w-full">
										{isEditing ? (
											<FormInput
												name="title"
												label=""
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
											<Link
												href={`/user/${issue.reporter?.id}`}
												className="text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors"
											>
												{issue.reporter?.name ?? 'Unknown'}
											</Link>
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
								{(isUsersIssue || hasStaffPermissionsFlag) && (
									<div className="flex items-center gap-2">
										{!isEditing ? (
											<>
												<Button
													variant="secondary"
													size="sm"
													animation="scale"
													onClick={() => setIsEditing(true)}
												>
													<Pencil className="w-4 h-4" />
													Edit
												</Button>
												<Button
													variant="destructive"
													size="sm"
													animation="scale"
													onClick={() => setShowDeleteConfirm(true)}
													disabled={isDeleting}
												>
													<Trash2 className="w-4 h-4" />
													Delete
												</Button>
											</>
										) : (
											<>
												<Button
													variant="outline"
													size="sm"
													animation="scale"
													onClick={handleCancel}
													disabled={isPending}
												>
													<X className="w-4 h-4" />
													Cancel
												</Button>
												<Button
													variant="success"
													size="sm"
													animation="scale"
													onClick={handleSave}
													disabled={isPending}
												>
													<Save className="w-4 h-4" />
													{isPending ? 'Saving...' : 'Save'}
												</Button>
											</>
										)}
									</div>
								)}
							</div>
							<div className="flex items-center gap-2">
								{!isEditing && (
									<IssueUpvoteButton
										issueId={issue.id}
										reporterId={issue.reporter.id}
										currentUserId={currentUserId}
										initialUpvoteCount={issue.numberOfUpvotes}
										initialIsUpvoted={
											currentUserId
												? issue.upvoters.some(
														upvoter => upvoter.id === currentUserId
													)
												: false
										}
										variant="default"
									/>
								)}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
						{/* Map section */}
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
												<div className="absolute top-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg z-1000 pointer-events-none">
													<p className="text-sm text-gray-700 text-center font-medium">
														Drag the marker to change the location
													</p>
												</div>
											)}
										</>
									) : (
										<div className="flex items-center justify-center h-full bg-linear-to-br from-orange-100 to-amber-100">
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

						{/* Details section */}
						<div className="order-2 lg:order-2">
							<form onSubmit={handleSave} className="space-y-6">
								<div className="bg-white/50 backdrop-blur-sm rounded-xl shadow-md border border-orange-200/50 p-4 sm:p-6 space-y-6">
										{/* Status */}
										{hasStaffPermissionsFlag && (
											isEditing ? (
												<FormSelect
													name="status"
													label="Status"
													options={ISSUE_STATUS_VALUES.map(status => ({
														value: status,
														label: status
															.split('_')
															.map(
																word =>
																	word.charAt(0).toUpperCase() + word.slice(1)
															)
															.join(' ')
													}))}
												/>
											) : (
												<div className="flex flex-col gap-2">
													<label className="text-sm font-semibold text-gray-700">
														Status
													</label>
													<div className="text-sm text-gray-800">
														{issue.status
															.split('_')
															.map(
																word =>
																	word.charAt(0).toUpperCase() + word.slice(1)
															)
															.join(' ')}
													</div>
												</div>
											)
										)}

										{/* Type */}
										{isEditing ? (
											<FormSelect
												name="type"
												label="Type"
												options={ISSUE_TYPE_VALUES.map(type => ({
													value: type,
													label: type
														.split('_')
														.map(
															word => word.charAt(0).toUpperCase() + word.slice(1)
														)
														.join(' ')
												}))}
											/>
										) : (
											<div className="flex flex-col gap-2">
												<label className="text-sm font-semibold text-gray-700">
													Type
												</label>
												<div className="text-sm text-gray-800">
													{issue.type
														.split('_')
														.map(
															word => word.charAt(0).toUpperCase() + word.slice(1)
														)
														.join(' ')}
												</div>
											</div>
										)}

										{/* Description */}
										{isEditing ? (
											<FormTextarea
												name="description"
												label="Description"
												rows={4}
											/>
										) : (
											<div className="flex flex-col gap-2">
												<label className="text-sm font-semibold text-gray-700">
													Description
												</label>
												<div className="text-sm text-gray-800 whitespace-pre-wrap">
													{issue.description || ''}
												</div>
											</div>
										)}

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
												<div className="flex gap-3">
													<Button
														type="button"
														variant="outline"
														size="lg"
														animation="scale"
														className="flex-1"
														onClick={handleCancel}
														disabled={isPending}
													>
														<X className="w-4 h-4" />
														Cancel
													</Button>
													<SubmitButton
														isLoading={isPending}
														className="flex-1"
													>
														<Save className="w-4 h-4" />
														Save Changes
													</SubmitButton>
												</div>
											</div>
										)}
									</div>
								</form>
							</div>
						</div>
					</div>
				</FormProvider>
			</div>
		</>
	);
};

export default IssueDetailView;
