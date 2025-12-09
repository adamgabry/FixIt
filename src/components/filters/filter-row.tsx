'use client';

import React from 'react';
import { X } from 'lucide-react';

import { cn } from '@/lib/cn';
import { Badge } from '@/components/badge';

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
	<div className="space-y-3">
		<label className="text-sm font-semibold text-gray-700">{label}</label>

		<div className="flex flex-wrap gap-2">
			{options.map(option => {
				const isSelected = selected.includes(option);
				return (
					<button
						key={option}
						onClick={() => onToggleAction(option)}
						className={cn(
							'group relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
							'border-2 backdrop-blur-sm',
							isSelected
								? 'bg-linear-to-r from-orange-500 to-amber-500 text-white border-orange-400 shadow-md hover:shadow-lg hover:from-orange-600 hover:to-amber-600 scale-100'
								: 'bg-white/80 text-gray-700 border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-900',
							'active:scale-95'
						)}
					>
						{getOptionColorAction && (
							<span
								className={cn(
									'w-3 h-3 rounded-full ring-2',
									isSelected ? 'ring-white/50' : 'ring-gray-300'
								)}
								style={{ backgroundColor: getOptionColorAction(option) }}
							/>
						)}
						<span>{getOptionLabelAction(option)}</span>
						{isSelected && (
							<X className="w-3 h-3 ml-1 opacity-80 group-hover:opacity-100" />
						)}
					</button>
				);
			})}
		</div>
	</div>
);
