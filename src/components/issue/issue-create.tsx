'use client';
//TODO refactor when fixing
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { getDownloadURL, ref, uploadBytes } from '@firebase/storage';
import { v4 } from 'uuid';
import { X, Send } from 'lucide-react';

import {
	IssueStatus,
	IssueType,
	type IssueValuesSchema
} from '@/modules/issue/schema';
import { createIssueAction } from '@/modules/issue/actions';
import { Button } from '@/components/buttons/button';
import { ImageUpload } from '@/components/image-upload';
import { storage } from '@/firebase';

import { SlidingPanel } from '../page-modifiers/sliding-panel';
import { LocationSearch } from '../location-search';
import { useSession } from '@/modules/auth/client';

// Dynamic import for Leaflet map to avoid SSR issues
const LocationPickerMap = dynamic(
	() =>
		import('@/components/issue/location-picker-map').then(
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
	const { data: session } = useSession();
	const [title, setTitle] = useState('');
	const [type, setType] = useState<IssueType>(
		Object.values(IssueType)[0] as IssueType
	);
	const [description, setDescription] = useState('');
	const [images, setImages] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [coords, setCoords] = useState(initialCoords);

	// Update coords when initialCoords changes (e.g., when clicking on main map)
	useEffect(() => {
		setCoords(initialCoords);
	}, [initialCoords]);

	if (!isOpen) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setIsSubmitting(true);

		try {
			const reporterId = session?.user?.id ?? '';
			if (!reporterId) {
				throw new Error('User not found');
			}

			const uploadedUrls = await Promise.all(
				images.map(async file => {
					const path = `images/${file.name}-${v4()}`;
					await uploadBytes(ref(storage, path), file);
					return await getDownloadURL(ref(storage, path));
				})
			);

			// TODO here should be used the zod
			const issueData: IssueValuesSchema = {
				title,
				type,
				status: IssueStatus.REPORTED,
				description,
				latitude: coords.lat,
				longitude: coords.lng,
				pictures: uploadedUrls,
				reporterId
			};

			await createIssueAction(issueData);

			// Reset form
			setTitle('');
			setType(Object.values(IssueType)[0] as IssueType);
			setDescription('');
			setImages([]);

			// Refresh the page to show new issue
			router.refresh();

			if (onSubmitAction) {
				onSubmitAction();
			}

			onCloseAction();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create issue');
			console.error('Error creating issue:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

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
							onResultSelectAction={(lat, lng) => setCoords({ lat, lng })}
						/>
					</div>
					<LocationPickerMap
						coords={coords}
						onCoordsChangeAction={setCoords}
						height="200px"
					/>
					<p className="mt-2 text-xs text-gray-600 text-center font-medium">
						Click on the map to select or adjust the issue location
					</p>
				</div>

				{/* Error Message */}
				{error && (
					<div className="mb-4 p-3 bg-red-50 border-2 border-red-200 rounded-lg backdrop-blur-sm">
						<p className="text-sm text-red-700 font-medium">{error}</p>
					</div>
				)}

				{/* Form */}
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div>
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							Title <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							required
							value={title}
							onChange={e => setTitle(e.target.value)}
							className="w-full border-2 border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200"
							placeholder="Enter issue title"
						/>
					</div>

					<div>
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							Type <span className="text-red-500">*</span>
						</label>
						<select
							value={type}
							onChange={e => setType(e.target.value as IssueType)}
							className="w-full border-2 border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200"
						>
							{Object.values(IssueType).map(typeValue => (
								<option key={typeValue} value={typeValue}>
									{typeValue
										.replace(/_/g, ' ')
										.replace(/\b\w/g, l => l.toUpperCase())}
								</option>
							))}
						</select>
					</div>

					<div>
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							Description <span className="text-red-500">*</span>
						</label>
						<textarea
							rows={4}
							required
							value={description}
							onChange={e => setDescription(e.target.value)}
							className="w-full border-2 border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 resize-none transition-all duration-200"
							placeholder="Describe the issue..."
						/>
					</div>

					<ImageUpload value={images} onChangeAction={setImages} />

					<div className="flex gap-3 mt-6 pt-4 border-t border-orange-200/50">
						<Button
							type="button"
							variant="outline"
							size="lg"
							animation="scale"
							onClick={onCloseAction}
							className="flex-1"
							disabled={isSubmitting}
						>
							<X className="w-4 h-4" />
							Cancel
						</Button>
						<Button
							type="submit"
							variant="default"
							size="lg"
							animation="scale"
							className="flex-1"
							disabled={isSubmitting}
						>
							<Send className="w-4 h-4" />
							{isSubmitting ? 'Creating...' : 'Create Issue'}
						</Button>
					</div>
				</form>
			</div>
		</SlidingPanel>
	);
};
