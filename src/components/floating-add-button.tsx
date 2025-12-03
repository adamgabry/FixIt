import Link from 'next/link';

import { Button } from '@/components/button';

export const FloatingAddButton = () => (
	<Link href="/issues/create">
		<Button className="fixed right-4 bottom-4 z-50 h-15 w-15 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
			<span className="text-4xl">+</span>
		</Button>
	</Link>
);
