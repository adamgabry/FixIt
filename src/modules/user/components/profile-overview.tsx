import { type User } from '@/modules/user/schema';
import { LabeledItem } from '@/components/labeled-item';
import { ProfilePicture } from '@/modules/user/components/profile-picture';

type ProfileOverviewProps = {
	user: User;
};

export const ProfileOverview = ({ user }: ProfileOverviewProps) => (
	<div className="flex flex-col gap-6">
		<div className="flex items-center gap-4">
			{user.image && (
				<ProfilePicture name={user.name} imageUrl={user.image} size={64} />
			)}

			<div className="flex flex-col">
				<span className="text-xl font-semibold">{user.name}</span>
				<span className="text-sm text-gray-500">{user.role}</span>
			</div>
		</div>
	</div>
);
