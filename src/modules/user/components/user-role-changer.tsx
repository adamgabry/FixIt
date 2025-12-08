'use client';

import { updateUserAction } from '@/modules/user/actions';
import { type Role, type User } from '@/modules/user/schema';
import { UserRoleDropdown } from '@/modules/user/components/user-role-dropdown';

type UserRoleChangerProps = {
	user: User;
};

export const UserRoleChanger = ({ user }: UserRoleChangerProps) => {
	const handleChange = async (newRole: Role) => {
		if (newRole !== user.role) {
			await updateUserAction(user.id, newRole as Role);
		}
	};

	return <UserRoleDropdown selectedRole={user.role} onChange={handleChange} />;
};
