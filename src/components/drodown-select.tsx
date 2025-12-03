type DropdownOption = {
	label: string;
	value: string;
};

type DropdownSelectProps = {
	options: DropdownOption[];
	selectedOption?: string;
};

export const DropdownSelect = ({
	options,
	selectedOption
}: DropdownSelectProps) => (
	<select value={selectedOption ?? ''}>
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
