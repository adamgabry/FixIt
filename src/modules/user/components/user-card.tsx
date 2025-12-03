import { LabeledItem } from '@/components/labeled-item';
import { type User } from '@/modules/user/schema';
import { UserRoleDropdown } from '@/modules/user/components/user-role-dropdown';

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
				<UserRoleDropdown selectedRole={user.role} />
			</LabeledItem>
		</li>
	</ul>
);
