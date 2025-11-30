import { LabeledItem } from '@/components/labeled-item';
import { type User } from '@/modules/user/schema';

type UserCardProps = {
	user: User;
};

export const UserCard = ({ user }: UserCardProps) => (
	<ul>
		<li>
			<LabeledItem label="Name"> {user.name}</LabeledItem>
		</li>
		<li>
			<LabeledItem label="Email"> {user.email}</LabeledItem>
		</li>
		<li>
			<LabeledItem label="Role"> {user.role}</LabeledItem>
		</li>
	</ul>
);
