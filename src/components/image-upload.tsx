'use client';

import { useState } from 'react';
import Image from 'next/image';

type ImageUploadProps = {
	value: File[];
	onChangeAction: (files: File[]) => void;
	label?: string;
};

export const ImageUpload = ({
	value,
	onChangeAction,
	label = 'Images'
}: ImageUploadProps) => {
	const [previewUrls, setPreviewUrls] = useState<string[]>([]);

	const handleFiles = (inputFiles: File[]) => {
		const updated = [...value, ...inputFiles];
		onChangeAction(updated);

		const newPreviews = inputFiles.map(file => URL.createObjectURL(file));
		setPreviewUrls(prev => [...prev, ...newPreviews]);
	};

	const handleRemove = (idx: number) => {
		const updatedFiles = value.filter((_, i) => i !== idx);
		onChangeAction(updatedFiles);

		setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
	};

	return (
		<div>
			<label className="block text-sm font-semibold mb-2 text-gray-700">
				{label}
			</label>

			<label
				className="w-full inline-flex items-center justify-center gap-2 h-11 px-4 rounded-md text-sm font-bold
               bg-gradient-to-r from-orange-500 to-amber-500 
               hover:from-orange-600 hover:to-amber-600 
               text-white shadow-md hover:shadow-lg
               border-2 border-orange-400/60 hover:border-orange-500 
               cursor-pointer transition-all duration-200"
			>
				Select images
				<input
					type="file"
					accept="image/*"
					multiple
					className="hidden"
					onChange={e => handleFiles(Array.from(e.target.files ?? []))}
				/>
			</label>

			<ImagePreviewList
				files={value}
				previewUrls={previewUrls}
				onRemoveAction={handleRemove}
			/>
		</div>
	);
};

export const ImagePreviewList = ({
	files,
	previewUrls,
	onRemoveAction
}: {
	files: File[];
	previewUrls: string[];
	onRemoveAction: (index: number) => void;
}) => {
	if (files.length === 0) return null;

	return (
		<div className="mt-3 space-y-2">
			{files.map((file, idx) => (
				<div
					key={idx}
					className="flex items-center justify-between p-2 bg-white/60 border border-orange-200 rounded-lg"
				>
					<div className="flex items-center gap-3">
						<Image
							src={previewUrls[idx] ?? URL.createObjectURL(file)}
							alt={file.name}
							width={48}
							height={48}
							className="w-12 h-12 object-cover rounded-md border"
							unoptimized
						/>

						<div className="text-sm text-gray-700">
							<p className="font-medium">{file.name}</p>
							<p className="text-xs text-gray-500">
								{(file.size / 1024).toFixed(1)} KB
							</p>
						</div>
					</div>

					<button
						type="button"
						onClick={() => onRemoveAction(idx)}
						className="text-red-600 text-xs font-semibold hover:underline"
					>
						Remove
					</button>
				</div>
			))}
		</div>
	);
};
