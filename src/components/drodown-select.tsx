type DropdownOption<T extends string> = {
	label: string;
	value: T;
};

type DropdownSelectProps<T extends string> = {
	options: DropdownOption<T>[];
	selectedOption?: T;
	onChange?: (value: T) => void;
};

export const DropdownSelect = <T extends string>({
	options,
	selectedOption,
	onChange
}: DropdownSelectProps<T>) => (
	<select
		value={selectedOption ?? ''}
		onChange={e => onChange?.(e.target.value as T)}
		className="border px-2 py-1 rounded"
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
