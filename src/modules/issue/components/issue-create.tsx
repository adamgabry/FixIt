'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { v4 } from 'uuid';
import { X, Send } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { useActionState, useTransition } from 'react';
import { toast } from 'sonner';

import { IssueType } from '@/modules/issue/schema';
import { createIssueAction } from '@/modules/issue/actions';
import { Button } from '@/components/buttons/button';
import { ImageUpload } from '@/components/image-upload';
import { storage } from '@/firebase';
import { FormInput } from '@/components/form/form-input';
import { FormTextarea } from '@/components/form/form-textarea';
import { FormSelect } from '@/components/form/form-select';
import { SubmitButton } from '@/components/form/submit-button';
import {
	type CreateIssueFormSchema,
	createIssueFormSchema
} from './create-issue-form/schema';

import { SlidingPanel } from '@/components/page-modifiers/sliding-panel';
import { LocationSearch } from '@/modules/map/location-search';

// Dynamic import for Leaflet map to avoid SSR issues
const LocationPickerMap = dynamic(
	() =>
		import('@/modules/issue/components/location-picker-map').then(
			mod => mod.LocationPickerMap
		),
	{
		ssr: false,
		loading: () => (
			<div className="mb-6">
				<label className="block text-sm font-medium mb-2 text-gray-700">
					Location <span className="text-red-500">*</span>
				</label>
				<div className="h-[200px] flex items-center justify-center bg-gray-100 rounded-lg border border-gray-300">
					<span className="text-sm text-gray-500">Loading map...</span>
				</div>
			</div>
		)
	}
);

type Props = {
	isOpen: boolean;
	coords: { lat: number; lng: number };
	onCloseAction: () => void;
	onSubmitAction?: () => void;
};

export const IssueCreator = ({
	isOpen,
	coords: initialCoords,
	onCloseAction,
	onSubmitAction
}: Props) => {
	const router = useRouter();
	const [state, formAction] = useActionState(createIssueAction, null);
	const [isPending, startTransition] = useTransition();
	const [images, setImages] = useState<File[]>([]);
	const [coords, setCoords] = useState(initialCoords);
	const handledRef = useRef(false);

	const form = useForm<CreateIssueFormSchema>({
		resolver: zodResolver(createIssueFormSchema),
		defaultValues: {
			type: Object.values(IssueType)[0] as IssueType,
			latitude: initialCoords.lat,
			longitude: initialCoords.lng
		}
	});

	// Update coords when initialCoords changes (e.g., when clicking on main map)
	useEffect(() => {
		setCoords(initialCoords);
		form.setValue('latitude', initialCoords.lat);
		form.setValue('longitude', initialCoords.lng);
	}, [initialCoords, form]);

	useEffect(() => {
		if (!state || handledRef.current) return;

		if (state.error) {
			toast.error(state.error);
			handledRef.current = true;
		}

		if (state.success && state.issue) {
			toast.success(`Issue "${state.issue.title}" created!`);
			handledRef.current = true;

			form.reset();
			setImages([]);

			router.refresh();
			onSubmitAction?.();
			onCloseAction();
		}
	}, [state]);

	const handleSubmit = form.handleSubmit(async values => {
		// Upload images to Firebase first
		const uploadedUrls = await Promise.all(
			images.map(async file => {
				const path = `images/${file.name}-${v4()}`;
				await uploadBytes(ref(storage, path), file);
				return await getDownloadURL(ref(storage, path));
			})
		);

		// Create FormData with all values
		const formData = new FormData();
		formData.append('title', values.title);
		formData.append('description', values.description);
		formData.append('type', values.type);
		formData.append('latitude', String(values.latitude));
		formData.append('longitude', String(values.longitude));

		// Append all picture URLs
		uploadedUrls.forEach(url => {
			formData.append('pictures', url);
		});

		startTransition(() => {
			handledRef.current = false;
			formAction(formData);
		});
	});

	if (!isOpen) return null;

	return (
		<SlidingPanel
			isOpen={isOpen}
			onCloseAction={onCloseAction}
			title="Create Issue"
		>
			<div>
				{/* Location Picker Map */}
				<div className="mb-6">
					<label className="block text-sm font-semibold mb-2 text-gray-700">
						Location <span className="text-red-500">*</span>
					</label>
					{/* Location Search */}
					<div className="mb-2">
						<LocationSearch
							onResultSelectAction={(lat, lng) => {
								setCoords({ lat, lng });
								form.setValue('latitude', lat);
								form.setValue('longitude', lng);
							}}
						/>
					</div>
					<LocationPickerMap
						coords={coords}
						onCoordsChangeAction={(newCoords) => {
							setCoords(newCoords);
							form.setValue('latitude', newCoords.lat);
							form.setValue('longitude', newCoords.lng);
						}}
						height="200px"
					/>
					<p className="mt-2 text-xs text-gray-600 text-center font-medium">
						Click on the map to select or adjust the issue location
					</p>
				</div>

				{/* Form */}
				<FormProvider {...form}>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<FormInput
							label="Title"
							name="title"
							placeholder="Enter issue title"
						/>

						<FormSelect
							label="Type"
							name="type"
							options={Object.values(IssueType).map(typeValue => ({
								value: typeValue,
								label: typeValue
									.replace(/_/g, ' ')
									.replace(/\b\w/g, l => l.toUpperCase())
							}))}
						/>

						<FormTextarea
							label="Description"
							name="description"
							rows={4}
							placeholder="Describe the issue..."
						/>

						<ImageUpload value={images} onChangeAction={setImages} />

						<div className="flex gap-3 mt-6 pt-4 border-t border-orange-200/50">
							<Button
								type="button"
								variant="outline"
								size="lg"
								animation="scale"
								onClick={onCloseAction}
								className="flex-1"
								disabled={isPending}
							>
								<X className="w-4 h-4" />
								Cancel
							</Button>
							<SubmitButton
								isLoading={isPending}
								className="flex-1"
							>
								<Send className="w-4 h-4" />
								Create Issue
							</SubmitButton>
						</div>
					</form>
				</FormProvider>
			</div>
		</SlidingPanel>
	);
};
