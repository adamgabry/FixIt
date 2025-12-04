import { DropdownSelect } from '@/components/drodown-select';
import { userSchema } from '@/modules/user/schema';

type UserRoleDropdownProps = {
	selectedRole?: string;
	onChange?: (role: string) => void;
};

export const UserRoleDropdown = ({
	selectedRole,
	onChange
}: UserRoleDropdownProps) => {
	const roles = userSchema.shape.role.options;
	const dropdownOptions = roles.map(role => ({
		label: role,
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
