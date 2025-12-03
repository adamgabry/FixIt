'use client';

import { IssueType } from '@/modules/issue/schema';
import { ISSUE_TYPE_COLORS, ISSUE_TYPE_LABELS } from '@/lib/issue-utils';
import { cn } from '@/lib/cn';

type TypeFilterRowProps = {
	types: IssueType[];
	onToggleAction: (t: IssueType) => void;
};

export const TypeFilterRow = ({
	types,
	onToggleAction
}: TypeFilterRowProps) => (
	<div className="space-y-2">
		<label className="text-sm font-medium text-gray-300">Issue Type</label>

		<div className="flex flex-wrap gap-2">
			{Object.values(IssueType).map(type => (
				<button
					key={type}
					onClick={() => onToggleAction(type)}
					className={cn(
						'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
						types.includes(type)
							? 'bg-gray-700 text-white'
							: 'text-gray-400 hover:bg-gray-800'
					)}
				>
					<span
						className="w-3 h-3 rounded-full"
						style={{ backgroundColor: ISSUE_TYPE_COLORS[type] }}
					/>
					<span>{ISSUE_TYPE_LABELS[type]}</span>
				</button>
			))}
		</div>
	</div>
);
