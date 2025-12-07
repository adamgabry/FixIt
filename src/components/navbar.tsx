'use client';

import { useState } from 'react';

import { cn } from '@/lib/cn';
import { UserAccountBadge } from '@/components/user-account-badge';
import { NavbarLogo } from '@/components/navbar/navbar-logo';
import { NavbarLink } from '@/components/navbar/navbar-link';
import { MobileMenuButton } from '@/components/navbar/mobile-menu-button';

export const Navbar = () => {
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	const closeMobileMenu = () => setMobileMenuOpen(false);

	return (
		<nav className="sticky top-0 z-50 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border-b border-orange-200/50 shadow-sm backdrop-blur-sm">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between h-18">
					{/* Logo & Navigation */}
					<div className="flex items-center gap-8">
						<NavbarLogo />

						{/* Desktop Navigation */}
						<nav className="hidden md:block" aria-label="Main navigation">
							<ul className="flex items-center gap-2">
								<li>
									<NavbarLink href="/issues/list">List</NavbarLink>
								</li>
							</ul>
						</nav>
					</div>

					{/* User Badge - Desktop */}
					<div className="hidden md:block">
						<UserAccountBadge />
					</div>

					{/* Mobile Menu Button */}
					<MobileMenuButton
						isOpen={mobileMenuOpen}
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
					/>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={cn(
					'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
					mobileMenuOpen
						? 'max-h-96 opacity-100'
						: 'max-h-0 opacity-0 pointer-events-none'
				)}
			>
				<div className="container mx-auto px-4 py-4 space-y-4 bg-orange-50/90 border-t border-orange-200/50">
					<nav aria-label="Mobile navigation">
						<ul className="space-y-2">
							<li>
								<NavbarLink href="/issues/list" onClick={closeMobileMenu}>
									List
								</NavbarLink>
							</li>
						</ul>
					</nav>
					<div className="pt-3 border-t border-orange-200/50">
						<UserAccountBadge />
					</div>
				</div>
			</div>
		</nav>
	);
};
