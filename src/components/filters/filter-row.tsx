'use client';

import React from 'react';

import { cn } from '@/lib/cn';

type FilterRowProps<T extends string> = {
	label: string;
	options: T[];
	selected: T[];
	onToggleAction: (option: T) => void;
	getOptionLabelAction?: (option: T) => string;
	getOptionColorAction?: (option: T) => string;
};

export const FilterRow = <T extends string>({
	label,
	options,
	selected,
	onToggleAction,
	getOptionLabelAction = option => option,
	getOptionColorAction
}: FilterRowProps<T>) => (
	<div className="space-y-2">
		<label className="text-sm font-medium">{label}</label>

		<div className="flex flex-wrap gap-2">
			{options.map(option => (
				<button
					key={option}
					onClick={() => onToggleAction(option)}
					className={cn(
						'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
						selected.includes(option)
							? 'bg-gray-300'
							: 'text-gray-400 hover:bg-gray-100 hover:text-black'
					)}
				>
					{getOptionColorAction && (
						<span
							className="w-3 h-3 rounded-full"
							style={{ backgroundColor: getOptionColorAction(option) }}
						/>
					)}
					<span>{getOptionLabelAction(option)}</span>
				</button>
			))}
		</div>
	</div>
);
