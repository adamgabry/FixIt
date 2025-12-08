import { LogInGithubButton } from '@/modules/auth/components/log-in-github-button';
import { LogOutButton } from '@/modules/auth/components/log-out-button';
import { useSession } from '@/modules/auth/client';
import { UserAccountBadge } from '@/modules/user/components/user-account-badge';

export const AuthComponent = () => {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return;
	}

	if (!session) {
		return <LogInGithubButton />;
	}

	return (
		<div className="flex items-center gap-4">
			<UserAccountBadge user={session.user} />
			<LogOutButton />
		</div>
	);
};
