'use client';

import { X } from 'lucide-react';

import { Button } from '@/components/buttons/button';

type SlidingPanelProps = {
	isOpen: boolean;
	onCloseAction: () => void;
	width?: string;
	children: React.ReactNode;
	title?: string;
};

export const SlidingPanel = ({
	isOpen,
	onCloseAction,
	width = 'max-w-md',
	title,
	children
}: SlidingPanelProps) => {
	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${
					isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
				}`}
				onClick={onCloseAction}
			/>

			{/* Panel */}
			<div
				className={`fixed right-0 top-0 h-full w-full ${width} bg-white/90 backdrop-blur-md shadow-2xl border-l-2 border-orange-200/50 z-50 transition-transform duration-300 ease-out overflow-y-auto ${
					isOpen ? 'translate-x-0' : 'translate-x-full'
				}`}
				onClick={e => e.stopPropagation()}
			>
				<div className="p-6 bg-gradient-to-br from-orange-50/30 via-amber-50/30 to-orange-50/30 min-h-full">
					{title && (
						<div className="flex items-center justify-between mb-6 pb-4 border-b border-orange-200/50">
							<h2 className="text-2xl font-bold text-gray-900">{title}</h2>

							<Button
								variant="ghost"
								size="icon"
								onClick={onCloseAction}
								className="h-8 w-8 hover:bg-orange-100 rounded-lg"
							>
								<X className="h-5 w-5" />
							</Button>
						</div>
					)}

					{children}
				</div>
			</div>
		</>
	);
};
