import { LabeledItem } from '@/components/labeled-item';
import { type User } from '@/modules/user/schema';
import { DeleteUserButton } from '@/modules/user/components/delete-user-button';
import { UserRoleChanger } from '@/modules/user/components/user-role-changer';

type UserCardProps = {
	user: User;
};

export const UserCard = ({ user }: UserCardProps) => (
	<ul className="py-4">
		<li>
			<LabeledItem label="Name"> {user.name}</LabeledItem>
		</li>
		<li>
			<LabeledItem label="Email"> {user.email}</LabeledItem>
		</li>
		<li>
			<LabeledItem label="Role">
				<UserRoleChanger user={user} />
			</LabeledItem>
		</li>
		<li>
			<LabeledItem label="Delete">
				<DeleteUserButton userId={user.id} />
			</LabeledItem>
		</li>
	</ul>
);
