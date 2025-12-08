'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

import {
	IssueStatus,
	IssueType,
	type IssueValuesSchema
} from '@/modules/issue/schema';
import { createIssueAction } from '@/modules/issue/actions';
import { Button } from '@/components/button';

import { SlidingPanel } from '../page-modifiers/sliding-panel';

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
			// TODO: Get actual logged-in user ID - currently using hardcoded value
			const reporterId = 1;

			const issueData: IssueValuesSchema = {
				title,
				type,
				status: IssueStatus.REPORTED,
				description,
				latitude: coords.lat,
				longitude: coords.lng,
				pictures: images,
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
					<LocationPickerMap
						coords={coords}
						onCoordsChange={setCoords}
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

					<div>
						<label className="block text-sm font-semibold mb-2 text-gray-700">
							Images
						</label>
						<input
							type="file"
							accept="image/*"
							multiple
							onChange={e => setImages(Array.from(e.target.files ?? []))}
							className="w-full border-2 border-orange-200 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-400 transition-all duration-200"
						/>
						{images.length > 0 && (
							<p className="mt-2 text-xs text-gray-600 font-medium">
								{images.length} file(s) selected
							</p>
						)}
					</div>

					<div className="flex gap-3 mt-6 pt-4 border-t border-orange-200/50">
						<Button
							type="button"
							variant="outline"
							onClick={onCloseAction}
							className="flex-1 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold shadow-md hover:shadow-lg border-2 border-orange-400/60 hover:border-orange-500 transition-all duration-200"
							disabled={isSubmitting}
						>
							{isSubmitting ? (
								<span className="flex items-center justify-center gap-2">
									<svg
										className="animate-spin h-4 w-4"
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
									Creating...
								</span>
							) : (
								'Create Issue'
							)}
						</Button>
					</div>
				</form>
			</div>
		</SlidingPanel>
	);
};
