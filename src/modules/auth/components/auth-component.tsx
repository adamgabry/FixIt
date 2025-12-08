import { LogInButton } from '@/modules/auth/components/log-in-button';
import { LogOutButton } from '@/modules/auth/components/log-out-button';
import { useSession } from '@/modules/auth/client';
import { UserAccountBadge } from '@/modules/user/components/user-account-badge';

export const AuthComponent = () => {
	const { data: session, isPending } = useSession();

	if (isPending) {
		return (
			<div className="flex items-center gap-2">
				<div className="h-8 w-20 animate-pulse rounded bg-gray-200" />
			</div>
		);
	}

	if (!session) {
		return <LogInButton />;
	}

	return (
		<div className="flex items-center gap-4">
			<UserAccountBadge user={session.user} />
			<LogOutButton />
		</div>
	);
};
