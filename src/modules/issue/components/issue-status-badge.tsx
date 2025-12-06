import React from 'react';

import { type IssueStatus } from '@/modules/issue/schema';
import { ISSUE_STATUS_LABELS } from '@/lib/issue-utils';

type IssueStatusBadgeProps = {
	status: IssueStatus;
};

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({
	status
}) => (
	<span className="inline-flex items-center bg-brand-softer border border-brand-subtle text-fg-brand-strong text-xs font-medium px-1.5 py-0.5 rounded-sm">
		{ISSUE_STATUS_LABELS[status]}
	</span>
);
