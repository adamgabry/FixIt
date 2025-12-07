'use client';

import { Menu, X } from 'lucide-react';

import { cn } from '@/lib/cn';

type MobileMenuButtonProps = {
	isOpen: boolean;
	onClick: () => void;
};

export const MobileMenuButton = ({
	isOpen,
	onClick
}: MobileMenuButtonProps) => (
	<button
		type="button"
		onClick={onClick}
		className={cn(
			'md:hidden p-2.5 rounded-xl transition-all duration-200',
			'hover:bg-white/50 active:scale-95',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
			isOpen ? 'bg-white/40 text-gray-900' : 'text-gray-700 hover:text-gray-900'
		)}
		aria-label="Toggle mobile menu"
		aria-expanded={isOpen}
	>
		{isOpen ? (
			<X className="w-6 h-6 transition-transform duration-200" />
		) : (
			<Menu className="w-6 h-6 transition-transform duration-200" />
		)}
	</button>
);
