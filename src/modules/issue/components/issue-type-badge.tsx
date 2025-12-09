import React from 'react';

import { ISSUE_TYPE_COLORS, ISSUE_TYPE_LABELS } from '@/lib/issue-utils';
import { type IssueType } from '@/modules/issue/schema';
import { Badge } from '@/components/badge';

type IssueTypeBadgeProps = {
	type: IssueType;
};

export const IssueTypeBadge: React.FC<IssueTypeBadgeProps> = ({ type }) => (
	<Badge variant="secondary" className="flex items-center gap-1.5">
		<span
			className="w-3 h-3 rounded-full"
			style={{ backgroundColor: ISSUE_TYPE_COLORS[type] }}
		/>
		{ISSUE_TYPE_LABELS[type]}
	</Badge>
);
