//TODO: define roles cleaner

import { DropdownSelect } from '@/components/drodown-select';
import { userSchema } from '@/modules/user/schema';

type UserRoleDropdownProps = {
	selectedRole?: string;
};

export const UserRoleDropdown = ({ selectedRole }: UserRoleDropdownProps) => {
	const roles = userSchema.shape.role.options;

	const dropdownOptions = roles.map(role => ({
		label: role,
		value: role
	}));

	return (
		<DropdownSelect options={dropdownOptions} selectedOption={selectedRole} />
	);
};
