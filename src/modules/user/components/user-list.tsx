import { getUsersFacade } from '@/modules/user/facade';
import { UserCard } from '@/modules/user/components/user-card';

export const UserList = async () => {
	const users = await getUsersFacade();

	return (
		<ul>
			{users.map(user => (
				<li key={user.id}>
					<UserCard user={user} />
				</li>
			))}
		</ul>
	);
};
