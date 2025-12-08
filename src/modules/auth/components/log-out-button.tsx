'use client';

import { signOut, useSession } from '@/modules/auth/client';
import { Button } from '@/components/button';

export const LogOutButton = () => {
	const { data: session } = useSession();

	if (!session) {
		return;
	}

	return (
		<div className="flex items-center rounded gap-4 border-1 border-black">
			<Button onClick={() => signOut()} className="px-4 py-2">
				Log Out
			</Button>
		</div>
	);
};
