'use client';

import Link from 'next/link';
import Image from 'next/image';

export const NavbarLogo = () => {
	return (
		<Link
			href="/"
			className="group flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 hover:bg-white/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
			aria-label="Go to homepage"
		>
			<Image
				src="/fixit-high-resolution-logo-transparent.png"
				alt="FixIt Logo"
				width={120}
				height={48}
				className="h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
				priority
			/>
		</Link>
	);
};
