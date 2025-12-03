'use client';

import { IssueStatus } from '@/modules/issue/schema';
import { ISSUE_STATUS_LABELS } from '@/lib/issue-utils';
import { cn } from '@/lib/cn';

type StatusFilterRowProps = {
	statuses: IssueStatus[];
	onToggleAction: (s: IssueStatus) => void;
};

export const StatusFilterRow = ({
	statuses,
	onToggleAction
}: StatusFilterRowProps) => (
	<div className="space-y-2">
		<label className="text-sm font-medium text-gray-300">Status</label>

		<div className="flex flex-wrap gap-2">
			{Object.values(IssueStatus).map(status => (
				<button
					key={status}
					onClick={() => onToggleAction(status)}
					className={cn(
						'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
						statuses.includes(status)
							? 'bg-gray-700 text-white'
							: 'text-gray-400 hover:bg-gray-800'
					)}
				>
					<span>{ISSUE_STATUS_LABELS[status]}</span>
				</button>
			))}
		</div>
	</div>
);
