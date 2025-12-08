'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { type PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';

type NavbarLinkProps = PropsWithChildren<
	LinkProps & {
		className?: string;
		onClick?: () => void;
	}
>;

export const NavbarLink = ({
	href,
	children,
	className,
	onClick,
	...linkProps
}: NavbarLinkProps) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			onClick={onClick}
			className={cn(
				'relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-base font-semibold transition-all duration-200',
				'hover:bg-white/30 hover:shadow-sm active:scale-[0.97]',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2',
				// Desktop styles
				'md:px-5 md:py-2.5 md:text-base',
				// Mobile styles - simple and clean
				'w-full py-3.5 text-base',
				isActive
					? 'bg-white/50 text-gray-900 shadow-sm md:bg-white/40 md:shadow-md'
					: 'bg-white/30 text-gray-800 hover:bg-white/40 md:bg-transparent md:text-gray-700 md:hover:text-gray-900 md:hover:bg-white/30 md:shadow-none',
				className
			)}
			{...linkProps}
		>
			{children}
			{isActive && (
				<span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full shadow-sm" />
			)}
		</Link>
	);
};
