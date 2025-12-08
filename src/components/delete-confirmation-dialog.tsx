'use client';

import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/button';
import { cn } from '@/lib/cn';

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
		<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
			<div className="bg-white/90 backdrop-blur-md rounded-xl shadow-2xl border-2 border-orange-200/50 max-w-md w-full p-6 z-[10000] transition-all duration-300 scale-100">
				{/* Icon and Title */}
				<div className="flex items-start gap-4 mb-4">
					<div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
						<AlertTriangle className="h-6 w-6 text-red-600" />
					</div>
					<div className="flex-1">
						<h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
						<p className="text-gray-600 leading-relaxed">{message}</p>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-3 justify-end mt-6 pt-4 border-t border-orange-200/50">
					<Button
						variant="outline"
						onClick={onClose}
						disabled={isDeleting}
						className={cn(
							'border-orange-200 hover:bg-orange-50',
							'hover:border-orange-300 transition-all duration-200'
						)}
					>
						{cancelText}
					</Button>
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
						className={cn(
							'bg-red-600 hover:bg-red-700 text-white',
							'border-2 border-red-500/60 hover:border-red-600',
							'shadow-md hover:shadow-lg transition-all duration-200',
							'disabled:opacity-50 disabled:cursor-not-allowed'
						)}
					>
						{isDeleting ? (
							<span className="flex items-center gap-2">
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
								Deleting...
							</span>
						) : (
							confirmText
						)}
					</Button>
				</div>
			</div>
		</div>
	);
};
