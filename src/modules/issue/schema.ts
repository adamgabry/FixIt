import { z } from 'zod';

import { userSchema } from '@/modules/user/schema';

export enum IssueStatus {
	REPORTED = 'reported',
	IN_PROGRESS = 'in_progress',
	FIXED = 'fixed',
	CLOSED = 'closed'
}

export enum IssueType {
	HOOLIGANISM = 'hooliganism',
	IMPROVEMENT_IDEA = 'improvement_idea',
	NATURE_PROBLEM = 'nature_problem',
	BROKEN = 'broken',
	ROAD = 'road'
}

export const ISSUE_STATUS_VALUES = Object.values(IssueStatus) as [
	IssueStatus,
	...IssueStatus[]
];
export const ISSUE_TYPE_VALUES = Object.values(IssueType) as [
	IssueType,
	...IssueType[]
];

export const issueSchema = z.object({
	id: z.number(),
	title: z.string().min(1),
	description: z.string(),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	type: z.enum(ISSUE_TYPE_VALUES),
	status: z.enum(ISSUE_STATUS_VALUES),
	pictureUrls: z.array(z.string()),
	createdAt: z.date(),
	updatedAt: z.date(),
	reporter: userSchema,
	numberOfUpvotes: z.number(),
	upvoters: z.array(userSchema)
});

// TODO used only when selecting, map DB row to this type, perform counting of likes, extracting urls from pictures,...
export type Issue = z.infer<typeof issueSchema>;

//TODO: used for inserts and updates
export const issueValuesSchema = z.object({
	title: z.string().min(1),
	description: z.string().min(1),
	latitude: z.number().min(-90).max(90),
	longitude: z.number().min(-180).max(180),
	type: z.enum(ISSUE_TYPE_VALUES),
	status: z.enum(ISSUE_STATUS_VALUES),
	pictures: z.array(z.instanceof(File)),
	reporterId: z.string()
});

//TODO: rename to IssueValues
export type IssueValuesSchema = z.infer<typeof issueValuesSchema>;
