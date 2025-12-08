import { and, eq, or } from 'drizzle-orm';

import { db } from '@/db';
import { issueLikes } from '@/db/schema/likes';
import { issuePictures } from '@/db/schema/issue-pictures';
import {
	issues,
	type IssueStatusRow,
	type IssueTypeRow
} from '@/db/schema/issues';
import { type IssueValuesSchema } from '@/modules/issue/schema';
import {
	createPicturesFacade,
	deletePicturesByIssueFacade
} from '@/modules/issuePicture/facade';

export const getIssues = async () => db.query.issues.findMany();

export const getIssueById = async (id: number) =>
	db.query.issues.findFirst({ where: eq(issues.id, id) });

export const getIssuesFiltered = async (filters: {
	statuses?: IssueStatusRow[] | null;
	types?: IssueTypeRow[] | null;
}) => {
	const whereParts = [];

	if (filters.statuses?.length) {
		const statusConditions = filters.statuses.map(s => eq(issues.status, s));
		whereParts.push(or(...statusConditions));
	}

	if (filters.types?.length) {
		const typeConditions = filters.types.map(t => eq(issues.type, t));
		whereParts.push(or(...typeConditions));
	}

	return db.query.issues.findMany({
		where: whereParts.length ? and(...whereParts) : undefined
	});
};

export const getIssuesFromUser = async (userId: string) =>
	db.query.issues.findMany({
		where: eq(issues.reporterId, userId)
	});

export const createIssue = async (newIssueData: IssueValuesSchema) => {
	const timestamp = Math.floor(Date.now() / 1000);

	const { pictures, ...issueValues } = newIssueData;

	const result = await db
		.insert(issues)
		.values({
			...issueValues,
			createdAt: timestamp,
			updatedAt: timestamp
		})
		.returning();

	const issue = result[0];

	if (pictures.length) {
		const pictureData = pictures.map(url => ({
			url,
			issueId: issue.id
		}));

		await createPicturesFacade(pictureData);
	}

	return issue;
};

export const updateIssue = async (
	id: number,
	updatedFormData: IssueValuesSchema
) => {
	const timestamp = Math.floor(Date.now() / 1000);

	const { pictures, ...issueValues } = updatedFormData;

	const result = await db
		.update(issues)
		.set({
			...issueValues,
			updatedAt: timestamp
		})
		.where(eq(issues.id, id))
		.returning();

	if (!result.length) throw new Error(`Issue with id ${id} not found`);

	const issue = result[0];

	if (pictures.length) {
		await deletePicturesByIssueFacade(id);

		const pictureData = pictures.map(url => ({ url, issueId: id }));
		await createPicturesFacade(pictureData);
	}

	return issue;
};

export const deleteIssue = async (id: number) => {
	// Delete related records first to avoid foreign key constraints
	await db.delete(issueLikes).where(eq(issueLikes.issueId, id));
	await db.delete(issuePictures).where(eq(issuePictures.issueId, id));

	await db.delete(issues).where(eq(issues.id, id));
};
