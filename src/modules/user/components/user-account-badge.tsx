import { type User } from 'better-auth';

type UserAccountBadgeProps = {
	user: User;
};

export const UserAccountBadge = ({ user }: UserAccountBadgeProps) => (
	<div className="flex items-center gap-4">
		<div className="flex flex-col items-end">
			<span className="text-sm font-medium text-gray-900">{user.name}</span>
			<span className="text-xs text-gray-500">{user.role}</span>
		</div>

		{user.image && (
			<img src={user.image} alt={user.name} className="h-8 w-8 rounded-full" />
		)}
	</div>
);
