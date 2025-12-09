'use client';

import { useRouter } from 'next/navigation';

import { signOut, useSession } from '@/modules/auth/client';
import { Button } from '@/components/buttons/button';

export const LogOutButton = () => {
	const { data: session } = useSession();
	const router = useRouter();

	if (!session) {
		return;
	}

	return (
		<Button
			variant="destructive"
			size="sm"
			animation="scale"
			onClick={() =>
				signOut({
					fetchOptions: {
						onSuccess: () => {
							router.push('/');
						}
					}
				})
			}
		>
			Log Out
		</Button>
	);
};
