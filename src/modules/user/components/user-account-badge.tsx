import Link from 'next/link';

import { type User } from '@/modules/user/schema';
import { ProfilePicture } from '@/modules/user/components/profile-picture';

type UserAccountBadgeProps = {
	user: User;
};

export const UserAccountBadge = ({ user }: UserAccountBadgeProps) => (
	<Link
		href="/profile"
		className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
	>
		<div className="flex flex-col items-end">
			<span className="text-sm font-medium text-gray-900">{user.name}</span>
			<span className="text-xs text-gray-500">{user.role}</span>
		</div>

		{user.image && <ProfilePicture name={user.name} imageUrl={user.image} />}
	</Link>
);
