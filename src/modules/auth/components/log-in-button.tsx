'use client';

import { signIn, useSession } from '@/modules/auth/client';
import { Button } from '@/components/button';

export const LogInButton = () => {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (session) {
		return <p>You are already logged in</p>;
	}

	return (
		<Button
			onClick={() => signIn.social({ provider: 'github' })}
			className="px-4 py-2 bg-black text-white rounded flex items-center gap-2"
		>
			Log in with GitHub
		</Button>
	);
};
