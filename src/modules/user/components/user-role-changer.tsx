'use client';

import { updateUserAction } from '@/modules/user/actions';
import { type User } from '@/modules/user/schema';
import { UserRoleDropdown } from '@/modules/user/components/user-role-dropdown';

type UserRoleChangerProps = {
	user: User;
};

export const UserRoleChanger = ({ user }: UserRoleChangerProps) => {
	const handleChange = async (newRole: string) => {
		if (newRole !== user.role) {
			await updateUserAction(user.id, { role: newRole as User['role'] });
		}
	};

	return <UserRoleDropdown selectedRole={user.role} onChange={handleChange} />;
};
