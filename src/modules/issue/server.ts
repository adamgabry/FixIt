import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { issues } from '@/db/schema/issues';
import { type IssueValuesSchema } from '@/modules/issue/schema';

export const getIssues = async () => db.query.issues.findMany();

export const getIssueById = async (id: number) =>
	db.query.issues.findFirst({ where: eq(issues.id, id) });

export const createIssue = async (newIssueData: IssueValuesSchema) => {
	const timestamp = Math.floor(Date.now() / 1000);

	// remove pictures before inserting into DB
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

	// TODO: upload pictures and insert into issuePictures

	return issue;
};

export const updateIssue = async (
	id: number,
	updatedFormData: IssueValuesSchema
) => {
	const timestamp = Math.floor(Date.now() / 1000);

	// remove pictures before inserting into DB
	const { pictures, ...issueValues } = updatedFormData;

	const result = await db
		.update(issues)
		.set({
			...issueValues,
			updatedAt: timestamp
		})
		.where(eq(issues.id, id))
		.returning();

	if (result.length === 0) throw new Error(`Issue with id ${id} not found`);

	return result[0];
};

export const deleteIssue = async (id: number) =>
	db.delete(issues).where(eq(issues.id, id));
