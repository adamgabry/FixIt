'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

import { IssueStatus, IssueType, type IssueValuesSchema } from '@/modules/issue/schema';
import { createIssueAction } from '@/modules/issue/actions';
import { Button } from '@/components/button';

type Props = {
	isOpen: boolean;
	coords: { lat: number; lng: number };
	onClose: () => void;
	onSubmit?: () => void;
};

export const IssueCreator = ({ isOpen, coords, onClose, onSubmit }: Props) => {
	const router = useRouter();
	const [title, setTitle] = useState('');
	const [type, setType] = useState<IssueType>(
		Object.values(IssueType)[0] as IssueType
	);
	const [status, setStatus] = useState<IssueStatus>(IssueStatus.REPORTED);
	const [description, setDescription] = useState('');
	const [images, setImages] = useState<File[]>([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

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
				status,
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
			setStatus(IssueStatus.REPORTED);
			setDescription('');
			setImages([]);
			
			// Refresh the page to show new issue
			router.refresh();
			
			if (onSubmit) {
				onSubmit();
			}
			
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to create issue');
			console.error('Error creating issue:', err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-black/40 z-50 transition-opacity duration-300 ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onClose}
			/>
			
			{/* Sliding Panel */}
			<div
				className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 transition-transform duration-300 ease-out overflow-y-auto ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
				onClick={e => e.stopPropagation()}
			>
				<div className="p-6">
					{/* Header */}
					<div className="flex items-center justify-between mb-6">
						<h2 className="text-2xl font-semibold text-gray-900">
							Create Issue
						</h2>
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="h-8 w-8"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>

					{/* Location Info */}
					<div className="mb-6 p-3 bg-gray-50 rounded-lg">
						<p className="text-xs font-medium text-gray-500 mb-1">Location</p>
						<p className="text-sm text-gray-700">
							{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
						</p>
					</div>

					{/* Error Message */}
					{error && (
						<div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					{/* Form */}
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700">
								Title <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								required
								value={title}
								onChange={e => setTitle(e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter issue title"
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700">
								Type <span className="text-red-500">*</span>
							</label>
							<select
								value={type}
								onChange={e => setType(e.target.value as IssueType)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								{Object.values(IssueType).map(typeValue => (
									<option key={typeValue} value={typeValue}>
										{typeValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700">
								Status
							</label>
							<select
								value={status}
								onChange={e => setStatus(e.target.value as IssueStatus)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								{Object.values(IssueStatus).map(statusValue => (
									<option key={statusValue} value={statusValue}>
										{statusValue.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
									</option>
								))}
							</select>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700">
								Description <span className="text-red-500">*</span>
							</label>
							<textarea
								rows={4}
								required
								value={description}
								onChange={e => setDescription(e.target.value)}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
								placeholder="Describe the issue..."
							/>
						</div>

						<div>
							<label className="block text-sm font-medium mb-2 text-gray-700">
								Images
							</label>
							<input
								type="file"
								accept="image/*"
								multiple
								onChange={e => setImages(Array.from(e.target.files ?? []))}
								className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
							{images.length > 0 && (
								<p className="mt-2 text-xs text-gray-500">
									{images.length} file(s) selected
								</p>
							)}
						</div>

						<div className="flex gap-3 mt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="flex-1"
								disabled={isSubmitting}
							>
								Cancel
							</Button>
							<Button
								type="submit"
								className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
								disabled={isSubmitting}
							>
								{isSubmitting ? 'Creating...' : 'Create Issue'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</>
	);
};
