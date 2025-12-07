'use server';

import type { IssueLikeValuesSchema } from '@/modules/issueLike/schema';
import {
	createLikeFacade,
	updateLikeFacade,
	deleteLikeFacade,
	toggleVoteFacade
} from '@/modules/issueLike/facade';

export const createLikeAction = async (data: IssueLikeValuesSchema) =>
	createLikeFacade(data);

export const updateLikeAction = async (
	userId: number,
	issueId: number,
	data: Partial<IssueLikeValuesSchema>
) => updateLikeFacade(userId, issueId, data);

export const deleteLikeAction = async (userId: number, issueId: number) =>
	deleteLikeFacade(userId, issueId);

/**
 * Server action to toggle a vote on an issue
 *
 * @param userId - The current user's ID (will come from auth session later)
 * @param issueId - The issue ID to vote on
 * @param voteType - 'upvote' or 'downvote'
 * @param reporterId - The issue creator's ID (to prevent self-voting)
 * @returns Updated vote state and aggregate counts
 */
export const toggleVoteAction = async (
	userId: number,
	issueId: number,
	voteType: 'upvote' | 'downvote',
	reporterId: number
) => {
	try {
		return await toggleVoteFacade(userId, issueId, voteType, reporterId);
	} catch (error) {
		console.error('toggleVoteAction error:', error);
		throw error;
	}
};
