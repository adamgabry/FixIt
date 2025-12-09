'use client';

import { signIn, useSession } from '@/modules/auth/client';
import { Button } from '@/components/buttons/button';

export const LogInGithubButton = () => {
	const { data: session } = useSession();

	if (session) {
		return <p>You are already logged in</p>;
	}

	return (
		<Button
			onClick={() => signIn.social({ provider: 'github' })}
			className="px-4 py-2 rounded flex items-center gap-2 border-1 border-black"
		>
			Log in with GitHub
		</Button>
	);
};
