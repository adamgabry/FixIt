import Link from 'next/link';

import { type User } from '@/modules/user/schema';
import { ProfilePicture } from '@/modules/user/components/profile-picture';
import { UserRoleChanger } from '@/modules/user/components/user-role-changer';

type UserCardProps = {
	user: User;
};

export const UserCard = ({ user }: UserCardProps) => (
	<Link
		href={`/user/${user.id}`}
		className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
	>
		<div className="flex flex-col items-end">
			<span className="text-sm font-medium text-gray-900">{user.name}</span>
			<span className="text-sm font-medium text-gray-900">{user.email}</span>
		</div>

		{user.image && <ProfilePicture name={user.name} imageUrl={user.image} />}

		<UserRoleChanger user={user} />
	</Link>
);
