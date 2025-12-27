import { z } from 'zod';

import { ISSUE_TYPE_VALUES, IssueType } from '@/modules/issue/schema';

export const createIssueFormSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	description: z.string().min(1, 'Description is required'),
	type: z.enum(ISSUE_TYPE_VALUES as [IssueType, ...IssueType[]]),
	latitude: z.coerce.number().min(-90).max(90),
	longitude: z.coerce.number().min(-180).max(180)
});

export type CreateIssueFormSchema = z.infer<typeof createIssueFormSchema>;

