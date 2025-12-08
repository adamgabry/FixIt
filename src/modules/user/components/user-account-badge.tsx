import { Circle } from 'lucide-react';

import { useSession } from '@/modules/auth/client';

export const UserAccountBadge = () => {
	const { data: session } = useSession();

	if (!session) {
		return;
	}

	return (
		<div className="flex items-center gap-6">
			<Circle fill="white" />
			<div>
				<div>{session.user.name}</div>
				<div>{session.user.role}</div>
			</div>
		</div>
	);
};
