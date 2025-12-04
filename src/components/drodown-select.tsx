type DropdownOption = {
	label: string;
	value: string;
};

type DropdownSelectProps = {
	options: DropdownOption[];
	selectedOption?: string;
	onChange?: (value: string) => void;
};

export const DropdownSelect = ({
	options,
	selectedOption,
	onChange
}: DropdownSelectProps) => (
	<select
		value={selectedOption ?? ''}
		onChange={e => onChange?.(e.target.value)}
	>
		<option value="" disabled>
			--
		</option>
		{options.map(option => (
			<option key={option.value} value={option.value}>
				{option.label}
			</option>
		))}
	</select>
);
