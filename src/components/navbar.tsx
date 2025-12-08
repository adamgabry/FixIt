'use client';

import Link, { type LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { type PropsWithChildren } from 'react';

import { cn } from '@/lib/cn';
import { UserAccountBadge } from '@/modules/user/components/user-account-badge';

type NavbarItemProps = PropsWithChildren<
	LinkProps & {
		className?: string;
	}
>;

const NavbarItem = ({
	href,
	children,
	className,
	...linkProps
}: NavbarItemProps) => {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={cn(
				'px-4 py-2 rounded-md',
				isActive ? 'bg-slate-200' : '',
				className
			)}
			{...linkProps}
		>
			{children}
		</Link>
	);
};

export const Navbar = () => (
	<nav className="bg-slate-300">
		<div className="container mx-auto py-3 flex items-center justify-between">
			<div className="flex items-center gap-6">
				<h1 className="text-lg font-semibold bg-slate-200 px-4 py-2 rounded-md">
					FixIt
				</h1>
				<ul className="flex gap-4">
					<li>
						<NavbarItem href="/issues/map">Map</NavbarItem>
					</li>
					<li>
						<NavbarItem href="/issues/list">List</NavbarItem>
					</li>
				</ul>
			</div>

			<UserAccountBadge />
		</div>
	</nav>
);
