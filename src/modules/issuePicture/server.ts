import { eq } from 'drizzle-orm';

import { db } from '@/db';
import { issuePictures } from '@/db/schema/issue-pictures';

import { type IssuePictureValuesSchema } from './schema';

export const getPicturesByIssue = async (issueId: number) =>
	db.query.issuePictures.findMany({
		where: eq(issuePictures.issueId, issueId)
	});

export const createPictures = async (newPictures: IssuePictureValuesSchema[]) =>
	db.insert(issuePictures).values(newPictures).returning();

export const deletePictureByUrl = async (url: string) => {
	await db.delete(issuePictures).where(eq(issuePictures.url, url));
};

export const deletePicturesByIssue = async (issueId: number) => {
	await db.delete(issuePictures).where(eq(issuePictures.issueId, issueId));
};
