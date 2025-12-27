import { z } from 'zod';

import {
	ISSUE_STATUS_VALUES,
	ISSUE_TYPE_VALUES,
	IssueStatus,
	IssueType
} from '@/modules/issue/schema';

export const updateIssueFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	type: z.enum(ISSUE_TYPE_VALUES as [IssueType, ...IssueType[]]),
	status: z.enum(ISSUE_STATUS_VALUES as [IssueStatus, ...IssueStatus[]]),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180)
});

export type UpdateIssueFormSchema = z.infer<typeof updateIssueFormSchema>;

