import Link from 'next/link';

import { type User } from '@/modules/user/schema';
import { ProfilePicture } from '@/modules/user/components/profile-picture';
import { UserRoleChanger } from '@/modules/user/components/user-role-changer';
import { Card } from '@/components/card';

type UserCardProps = {
	user: User;
};

export const UserCard = ({ user }: UserCardProps) => (
	<Card variant="outlined" hover="lift" clickable className="mb-4">
		<div className="flex items-center gap-4 transition-opacity">
			<Link
				href={`/user/${user.id}`}
				className="flex items-center gap-4 flex-1"
			>
				<div className="flex flex-col items-end flex-1">
					<span className="text-sm font-medium text-gray-900">{user.name}</span>
					<span className="text-sm text-gray-600">{user.email}</span>
				</div>

				{user.image && (
					<ProfilePicture name={user.name} imageUrl={user.image} />
				)}
			</Link>

			<UserRoleChanger user={user} />
		</div>
	</Card>
);
