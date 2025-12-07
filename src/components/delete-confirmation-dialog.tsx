'use client';

import { Button } from '@/components/button';

type DeleteConfirmationDialogProps = {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isDeleting?: boolean;
	title?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
};

export const DeleteConfirmationDialog = ({
	isOpen,
	onClose,
	onConfirm,
	isDeleting = false,
	title = 'Delete Issue',
	message = 'Are you sure you want to delete this issue? This action cannot be undone.',
	confirmText = 'Delete',
	cancelText = 'Cancel'
}: DeleteConfirmationDialogProps) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
			<div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 z-[10000]">
				<h2 className="text-xl font-semibold mb-4">{title}</h2>
				<p className="text-gray-600 mb-6">{message}</p>
				<div className="flex gap-3 justify-end">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isDeleting}
						className="hover:bg-gray-100 hover:border-gray-300"
					>
						{cancelText}
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
						className="bg-red-600 hover:bg-red-700 text-white"
					>
						{isDeleting ? 'Deleting...' : confirmText}
					</Button>
				</div>
			</div>
		</div>
	);
};

