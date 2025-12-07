'use client';

import { Button } from '@/components/button';

type FloatingAddButtonProps = {
	onClick?: () => void;
};

export const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => (
	<Button
		onClick={onClick}
		className="fixed right-4 bottom-4 z-50 h-15 w-15 rounded-full bg-black text-white flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors"
	>
		<span className="text-4xl">+</span>
	</Button>
);
