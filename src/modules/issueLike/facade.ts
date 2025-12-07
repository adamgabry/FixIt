import {
	createLike,
	deleteLike,
	getIssuesLikedByUser,
	getLikeByUserAndIssue,
	getUsersWhoLikedIssue,
	updateLike,
	upsertVote,
	getIssueVoteScore,
	getIssueVoteCounts
} from '@/modules/issueLike/server';
import { type User } from '@/modules/user/schema';
import { getUserByIdFacade } from '@/modules/user/facade';
import { getIssueByIdFacade } from '@/modules/issue/facade';
import { type Issue } from '@/modules/issue/schema';
import {
	type IssueLike,
	type IssueLikeValuesSchema
} from '@/modules/issueLike/schema';

export const getIssuesLikedByUserFacade = async (
	userId: number
): Promise<Issue[]> => {
	const likes = await getIssuesLikedByUser(userId);

	const issues: (Issue | null)[] = await Promise.all(
		likes.map(async like => getIssueByIdFacade(like.issueId))
	);

	// filter out null if issue was deleted
	return issues.filter((issue): issue is Issue => issue !== null);
};

export const getUsersWhoLikedIssueFacade = async (
	issueId: number
): Promise<User[]> => {
	const likes = await getUsersWhoLikedIssue(issueId);

	const users: (User | null)[] = await Promise.all(
		likes.map(async like => getUserByIdFacade(like.userId))
	);

	// filter out any null if user was deleted
	return users.filter((user): user is User => user !== null);
};

export const getLikeByUserAndIssueFacade = async (
	userId: number,
	issueId: number
): Promise<IssueLike | null> => {
	const like = await getLikeByUserAndIssue(userId, issueId);

	if (!like) return null;

	const user = await getUserByIdFacade(userId);
	const issue = await getIssueByIdFacade(issueId);

	if (!user || !issue) return null;

	return { user, issue };
};

export const createLikeFacade = async (
	data: IssueLikeValuesSchema
): Promise<IssueLike> => {
	const like = await createLike(data);

	const user = await getUserByIdFacade(like.userId);
	const issue = await getIssueByIdFacade(like.issueId);

	if (!user || !issue) {
		throw new Error('User or Issue not found for the created like');
	}

	return { user, issue };
};

export const updateLikeFacade = async (
	userId: number,
	issueId: number,
	data: Partial<IssueLikeValuesSchema>
): Promise<IssueLike> => {
	const like = await updateLike(userId, issueId, data);

	const user = await getUserByIdFacade(like.userId);
	const issue = await getIssueByIdFacade(like.issueId);

	if (!user || !issue) {
		throw new Error('User or Issue not found for the updated like');
	}

	return { user, issue };
};

export const deleteLikeFacade = async (userId: number, issueId: number) => {
	await deleteLike(userId, issueId);
};

/**
 * Toggle vote for an issue following the state machine:
 * - Neutral → click upvote → Upvoted (+1)
 * - Upvoted → click upvote → Neutral (delete)
 * - Neutral → click downvote → Downvoted (-1)
 * - Downvoted → click downvote → Neutral (delete)
 * - Upvoted → click downvote → Downvoted (-1)
 * - Downvoted → click upvote → Upvoted (+1)
 *
 * @param userId - The user performing the vote
 * @param issueId - The issue being voted on
 * @param voteType - 'upvote' or 'downvote'
 * @param reporterId - The ID of the issue creator (to prevent self-voting)
 * @returns Updated vote state and counts
 */
export const toggleVoteFacade = async (
	userId: number,
	issueId: number,
	voteType: 'upvote' | 'downvote',
	reporterId: number
): Promise<{
	voteValue: number; // Current user's vote: -1, 0, or 1
	upvotes: number;
	downvotes: number;
	score: number;
}> => {
	// Prevent issue creator from voting on their own issue
	if (userId === reporterId) {
		throw new Error('Issue creator cannot vote on their own issue');
	}

	const targetValue = voteType === 'upvote' ? 1 : -1;
	const existingVote = await getLikeByUserAndIssue(userId, issueId);

	let newVoteValue = 0;

	if (!existingVote) {
		// Neutral → Upvoted or Downvoted
		await upsertVote({ userId, issueId, voteValue: targetValue });
		newVoteValue = targetValue;
	} else if (existingVote.voteValue === targetValue) {
		// Upvoted → click upvote → Neutral (remove vote)
		// Downvoted → click downvote → Neutral (remove vote)
		await deleteLike(userId, issueId);
		newVoteValue = 0;
	} else {
		// Upvoted → click downvote → Downvoted
		// Downvoted → click upvote → Upvoted
		await upsertVote({ userId, issueId, voteValue: targetValue });
		newVoteValue = targetValue;
	}

	// Get updated counts
	const counts = await getIssueVoteCounts(issueId);

	return {
		voteValue: newVoteValue,
		...counts
	};
};

/**
 * Get the current user's vote value for an issue
 * Returns -1 (downvote), 0 (no vote), or 1 (upvote)
 */
export const getUserVoteValueFacade = async (
	userId: number,
	issueId: number
): Promise<number> => {
	const vote = await getLikeByUserAndIssue(userId, issueId);
	return vote?.voteValue ?? 0;
};

/**
 * Get vote counts for an issue
 */
export const getIssueVoteCountsFacade = async (issueId: number) => {
	return await getIssueVoteCounts(issueId);
};
