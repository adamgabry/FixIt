'use client';

import { useState } from 'react';

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

		// Preview
		const newPreviews = inputFiles.map(file => URL.createObjectURL(file));
		setPreviewUrls(prev => [...prev, ...newPreviews]);
	};

	const handleRemove = (idx: number) => {
		// Remove file
		const updatedFiles = value.filter((_, i) => i !== idx);
		onChangeAction(updatedFiles);

		// Remove preview
		setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
	};

	return (
		<div>
			<label className="block text-sm font-semibold mb-2 text-gray-700">
				{label}
			</label>

			{/* Styled upload button */}
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

			{/* Preview list */}
			{value.length > 0 && (
				<div className="mt-3 space-y-2">
					{value.map((file, idx) => (
						<div
							key={idx}
							className="flex items-center justify-between p-2 bg-white/60 border border-orange-200 rounded-lg"
						>
							<div className="flex items-center gap-3">
								<img
									src={previewUrls[idx] ?? URL.createObjectURL(file)}
									alt={file.name}
									className="w-12 h-12 object-cover rounded-md border"
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
								onClick={() => handleRemove(idx)}
								className="text-red-600 text-xs font-semibold hover:underline"
							>
								Remove
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};
