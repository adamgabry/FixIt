'use client';

import { Input } from '@/components/input';

type SearchFilterProps = {
	value: string;
	onChangeAction: (value: string) => void;
};

export const SearchFilter = ({ value, onChangeAction }: SearchFilterProps) => (
	<div className="space-y-2">
		<label>Search</label>
		<Input
			type="text"
			placeholder="Search issues..."
			value={value}
			onChange={e => onChangeAction(e.target.value)}
			className="border-gray-400"
		/>
	</div>
);
