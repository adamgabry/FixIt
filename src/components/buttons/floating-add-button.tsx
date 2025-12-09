'use client';

import { Plus } from 'lucide-react';

import { Button } from '@/components/buttons/button';

type FloatingAddButtonProps = {
	onClick?: () => void;
};

export const FloatingAddButton = ({ onClick }: FloatingAddButtonProps) => (
	<Button
		onClick={onClick}
		size="icon"
		className="fixed right-4 bottom-4 z-1000 h-16 w-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white flex items-center justify-center shadow-xl hover:shadow-2xl border-2 border-orange-400/60 hover:border-orange-500 backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95"
	>
		<Plus className="h-8 w-8" strokeWidth={2.5} />
	</Button>
);
