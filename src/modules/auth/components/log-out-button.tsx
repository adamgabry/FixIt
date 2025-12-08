'use client';

import { useRouter } from 'next/navigation';

import { signOut, useSession } from '@/modules/auth/client';
import { Button } from '@/components/button';

export const LogOutButton = () => {
	const { data: session } = useSession();
	const router = useRouter();

	if (!session) {
		return;
	}

	return (
		<div className="flex items-center rounded gap-4 border-1 border-black">
			<Button
				onClick={() =>
					signOut({
						fetchOptions: {
							onSuccess: () => {
								router.push('/');
							}
						}
					})
				}
				className="px-4 py-2"
			>
				Log Out
			</Button>
		</div>
	);
};
