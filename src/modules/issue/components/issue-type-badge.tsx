import React from 'react';

import { ISSUE_TYPE_COLORS, ISSUE_TYPE_LABELS } from '@/lib/issue-utils';
import { type IssueType } from '@/modules/issue/schema';
type IssueTypeBadgeProps = {
	type: IssueType;
};

export const IssueTypeBadge: React.FC<IssueTypeBadgeProps> = ({ type }) => (
	<span className="inline-flex items-center bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded-sm">
		<span
			className="w-3 h-3 rounded-full mr-1.5"
			style={{ backgroundColor: ISSUE_TYPE_COLORS[type] }}
		/>
		{ISSUE_TYPE_LABELS[type]}
	</span>
);
