'use client';

import { Input } from '@/components/input';

type SearchFilterProps = {
	value: string;
	onChangeAction: (value: string) => void;
};

export const SearchFilter = ({ value, onChangeAction }: SearchFilterProps) => (
	<div className="space-y-2">
		<label className="text-sm font-medium text-gray-300">Search</label>
		<Input
			type="text"
			placeholder="Search issues..."
			value={value}
			onChange={e => onChangeAction(e.target.value)}
			className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-500"
		/>
	</div>
);
