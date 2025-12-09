'use client';

import { Search } from 'lucide-react';

import { Input } from '@/components/input';

type SearchFilterProps = {
	value: string;
	onChangeAction: (value: string) => void;
};

export const SearchFilter = ({ value, onChangeAction }: SearchFilterProps) => (
	<div className="space-y-3">
		<label className="text-sm font-semibold text-gray-700">Search</label>
		<div className="relative">
			<Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
			<Input
				type="text"
				placeholder="Start searching..."
				value={value}
				onChange={e => onChangeAction(e.target.value)}
				className="pl-10 border-2 border-gray-200 focus:border-orange-400 bg-white/80 backdrop-blur-sm"
			/>
		</div>
	</div>
);
