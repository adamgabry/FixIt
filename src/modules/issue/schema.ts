import { z } from 'zod';

export enum IssueStatus {
	OPEN = 'OPEN',
	IN_PROGRESS = 'IN_PROGRESS',
	CLOSED = 'CLOSED'
}

export enum IssueType {
	BUG = 'BUG',
	FEATURE = 'FEATURE',
	TASK = 'TASK'
}

export const issueSchema = z.object({
	id: z.number(),
	title: z.string().min(1),
	description: z.string().min(1),
	location: z.string().min(1),
	status: IssueStatus,
	type: IssueType,
	pictures: z.string().min(1),
	createdAt: z.date(),
	upddatedAt: z.date(),
	reportedBy: z.number(),
	numberOfUpvotes: z.number()
});

export type Issue = z.infer<typeof issueSchema>;
