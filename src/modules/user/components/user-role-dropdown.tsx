import { DropdownSelect } from '@/components/drodown-select';
import { type Role, userSchema } from '@/modules/user/schema';

type UserRoleDropdownProps = {
	selectedRole?: Role;
	onChange?: (roleValue: Role) => void;
};

export const UserRoleDropdown = ({
	selectedRole,
	onChange
}: UserRoleDropdownProps) => {
	const roles = userSchema.shape.role.options;
	const dropdownOptions = roles.map(role => ({
		label: role as string,
		value: role
	}));

	return (
		<DropdownSelect
			options={dropdownOptions}
			selectedOption={selectedRole}
			onChange={onChange}
		/>
	);
};
