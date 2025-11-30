import { UserIcon } from 'lucide-react';

import { type User } from '@/modules/user/schema';
import { LabeledItem } from '@/components/labeled-item';

type ProfileOverviewProps = {
	user: User;
};

export const ProfileOverview = ({ user }: ProfileOverviewProps) => (
	<div className="flex">
		<UserIcon width={100} height={100} />
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
			<li>
				<LabeledItem label="Number of reported issues"> 1</LabeledItem>
			</li>
		</ul>
	</div>
);
