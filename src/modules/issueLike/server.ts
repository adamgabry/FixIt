import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { issueLikes } from '@/db/schema/likes';
import { type IssueLikeValuesSchema } from '@/modules/issueLike/schema';

export const getLikes = async () => db.query.issueLikes.findMany();

export const getIssuesLikedByUser = async (userId: number) =>
	db.query.issueLikes.findMany({
		where: eq(issueLikes.userId, userId)
	});

export const getUsersWhoLikedIssue = async (issueId: number) =>
	db.query.issueLikes.findMany({
		where: eq(issueLikes.issueId, issueId)
	});

export const getLikeByUserAndIssue = async (userId: number, issueId: number) =>
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

export const upsertVote = async (newLike: IssueLikeValuesSchema) => {
	const existing = await db.query.issueLikes.findFirst({
		where: and(
			eq(issueLikes.userId, newLike.userId),
			eq(issueLikes.issueId, newLike.issueId)
		)
	});

	if (existing) {
		// Update existing vote
		const result = await db
			.update(issueLikes)
			.set({ voteValue: newLike.voteValue })
			.where(
				and(
					eq(issueLikes.userId, newLike.userId),
					eq(issueLikes.issueId, newLike.issueId)
				)
			)
			.returning();
		return result[0];
	}

	// Create new vote
	const result = await db.insert(issueLikes).values(newLike).returning();
	return result[0];
};

export const updateLike = async (
	userId: number,
	issueId: number,
	data: Partial<IssueLikeValuesSchema>
) => {
	const result = await db
		.update(issueLikes)
		.set(data)
		.where(and(eq(issueLikes.userId, userId), eq(issueLikes.issueId, issueId)))
		.returning();

	if (result.length === 0) {
		throw new Error(`Like not found for user ${userId} and issue ${issueId}`);
	}

	return result[0];
};

export const deleteLike = async (userId: number, issueId: number) => {
	await db
		.delete(issueLikes)
		.where(and(eq(issueLikes.userId, userId), eq(issueLikes.issueId, issueId)));
};

/**
 * Get vote score (sum of all vote values) for an issue
 * Returns the total score (upvotes - downvotes)
 */
export const getIssueVoteScore = async (issueId: number): Promise<number> => {
	const votes = await db.query.issueLikes.findMany({
		where: eq(issueLikes.issueId, issueId)
	});

	return votes.reduce((sum, vote) => sum + vote.voteValue, 0);
};

/**
 * Get vote counts for an issue
 * Returns { upvotes, downvotes, score }
 */
export const getIssueVoteCounts = async (
	issueId: number
): Promise<{ upvotes: number; downvotes: number; score: number }> => {
	const votes = await db.query.issueLikes.findMany({
		where: eq(issueLikes.issueId, issueId)
	});

	const upvotes = votes.filter(v => v.voteValue === 1).length;
	const downvotes = votes.filter(v => v.voteValue === -1).length;

	return {
		upvotes,
		downvotes,
		score: upvotes - downvotes
	};
};
