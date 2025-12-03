import { z } from 'zod';

export enum IssueStatus {
	OPEN = 'OPEN',
	IN_PROGRESS = 'IN_PROGRESS',
	CLOSED = 'CLOSED'
}

export enum IssueType {
	HOOLIGANISM = 'HOOLIGANISM',
	IMPROVEMENT_IDEA = 'IMPROVEMENT_IDEA',
	NATURE_PROBLEM = 'NATURE_PROBLEM',
	BROKEN = 'BROKEN',
	ROAD = 'ROAD'
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
	updatedAt: z.date(),
	reportedBy: z.number(),
	numberOfUpvotes: z.number()
});

export type Issue = z.infer<typeof issueSchema>;
