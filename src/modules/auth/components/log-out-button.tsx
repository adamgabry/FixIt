import { signOut, useSession } from '@/modules/auth/client';
import { Button } from '@/components/button';

export const LogOutButton = () => {
	const { data: session } = useSession();

	if (!session) {
		return;
	}

	return (
		<div className="flex items-center gap-4">
			<Button onClick={() => signOut()} className="px-4 py-2">
				Sign Out
			</Button>
		</div>
	);
};
