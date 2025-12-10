import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { issueLikes } from '@/db/schema/likes';
import { type IssueLikeValuesSchema } from '@/modules/issueLike/schema';

export const getIssuesLikedByUser = async (userId: string) =>
	db.query.issueLikes.findMany({
		where: eq(issueLikes.userId, userId)
	});

export const getUsersWhoLikedIssue = async (issueId: number) =>
	db.query.issueLikes.findMany({
		where: eq(issueLikes.issueId, issueId)
	});

export const getLikeByUserAndIssue = async (userId: string, issueId: number) =>
	db.query.issueLikes.findFirst({
		where: and(eq(issueLikes.userId, userId), eq(issueLikes.issueId, issueId))
	});

export const createLike = async (newLike: IssueLikeValuesSchema) => {
	const existing = await db.query.issueLikes.findFirst({
		where: and(
			eq(issueLikes.userId, newLike.userId),
			eq(issueLikes.issueId, newLike.issueId)
		)
	});

	if (existing) {
		return existing;
	}

	const result = await db.insert(issueLikes).values(newLike).returning();

	return result[0];
};

export const deleteLike = async (userId: string, issueId: number) => {
	await db
		.delete(issueLikes)
		.where(and(eq(issueLikes.userId, userId), eq(issueLikes.issueId, issueId)));
};
