'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import { deletePictureAction } from '@/modules/issuePicture/actions';
import { type IssuePicture } from '@/modules/issuePicture/schema';

type IssueImagesListProps = {
	images: IssuePicture[];
	setImagesAction: React.Dispatch<React.SetStateAction<IssuePicture[]>>;
	isEditing: boolean;
};

export const IssueImagesList = ({
	images,
	setImagesAction,
	isEditing
}: IssueImagesListProps) => {
	const [modalOpen, setModalOpen] = useState(false);
	const [modalSrc, setModalSrc] = useState<string>('');
	const [deletingUrls, setDeletingUrls] = useState<string[]>([]);

	const handleClick = (src: string) => {
		setModalSrc(src);
		setModalOpen(true);
	};

	const handleClose = () => {
		setModalOpen(false);
		setModalSrc('');
	};

	const handleDelete = async (img: IssuePicture) => {
		setDeletingUrls(prev => [...prev, img.url]);
		try {
			await deletePictureAction(img.url);
			setImagesAction(prev => prev.filter(i => i.url !== img.url));
		} catch (error) {
			console.error('Failed to delete picture:', error);
			alert('Failed to delete image.');
		} finally {
			setDeletingUrls(prev => prev.filter(u => u !== img.url));
		}
	};

	if (images.length === 0) return null;

	return (
		<div className="mt-3 grid grid-cols-2 gap-3">
			{images.map((img: IssuePicture) => (
				<div
					key={img.url}
					className="aspect-square relative group border-2 border-orange-200 rounded-lg overflow-hidden cursor-pointer bg-gray-100"
				>
					<Image
						src={img.url}
						fill
						className="object-cover"
						unoptimized
						alt="Issue image"
						onClick={() => handleClick(img.url)}
					/>
					{isEditing && (
						<button
							type="button"
							onClick={e => {
								e.stopPropagation();
								handleDelete(img);
							}}
							className={`absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1.5 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity ${
								deletingUrls.includes(img.url)
									? 'opacity-100 cursor-not-allowed bg-gray-400 hover:bg-gray-500'
									: ''
							}`}
							title="Delete image"
							disabled={deletingUrls.includes(img.url)}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-4 w-4"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
							</svg>
						</button>
					)}
				</div>
			))}

			{modalOpen && (
				<div
					className="fixed inset-0 bg-black/10 flex items-center justify-center "
					onClick={handleClose}
				>
					<Image
						src={modalSrc}
						alt="Full-size"
						width={1920}
						height={1080}
						className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
						unoptimized
					/>
				</div>
			)}
		</div>
	);
};
