import { getUsersFacade } from '@/modules/user/facade';
import { UserCard } from '@/modules/user/components/user-card';

export const UserList = async () => {
	const users = await getUsersFacade();

	return (
		<div className="p-6 max-w-4xl mx-auto">
			<ul className="space-y-0">
				{users.map(user => (
					<li key={user.id}>
						<UserCard user={user} />
					</li>
				))}
			</ul>
		</div>
	);
};
