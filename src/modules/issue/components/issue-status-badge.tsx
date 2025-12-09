import React from 'react';

import { type IssueStatus } from '@/modules/issue/schema';
import { ISSUE_STATUS_LABELS } from '@/lib/issue-utils';
import { Badge } from '@/components/badge';

type IssueStatusBadgeProps = {
	status: IssueStatus;
};

const statusVariantMap: Record<
	IssueStatus,
	'success' | 'warning' | 'info' | 'default'
> = {
	[IssueStatus.REPORTED]: 'warning',
	[IssueStatus.IN_PROGRESS]: 'info',
	[IssueStatus.FIXED]: 'success',
	[IssueStatus.CLOSED]: 'default'
};

export const IssueStatusBadge: React.FC<IssueStatusBadgeProps> = ({
	status
}) => (
	<Badge variant={statusVariantMap[status] || 'default'}>
		{ISSUE_STATUS_LABELS[status]}
	</Badge>
);
