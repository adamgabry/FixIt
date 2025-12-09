'use server';

import { revalidatePath } from 'next/cache';

import type { IssueLikeValuesSchema } from '@/modules/issueLike/schema';
import {
	createLikeFacade,
	updateLikeFacade,
	deleteLikeFacade,
	getLikeByUserAndIssueFacade
} from '@/modules/issueLike/facade';

export const createLikeAction = async (data: IssueLikeValuesSchema) =>
	createLikeFacade(data);

export const updateLikeAction = async (
	userId: string,
	issueId: number,
	data: Partial<IssueLikeValuesSchema>
) => updateLikeFacade(userId, issueId, data);

export const deleteLikeAction = async (userId: string, issueId: number) =>
	deleteLikeFacade(userId, issueId);

export async function toggleUpvoteAction(
	issueId: number,
	userId: string
): Promise<{ success: boolean; isUpvoted: boolean; error?: string }> {
	try {
		// Check if the user has already upvoted this issue
		const existingLike = await getLikeByUserAndIssueFacade(userId, issueId);

		if (existingLike) {
			// Remove the upvote
			await deleteLikeFacade(userId, issueId);
			revalidatePath('/issues/list');
			revalidatePath(`/issues/${issueId}`);
			return { success: true, isUpvoted: false };
		} else {
			// Add the upvote
			await createLikeFacade({ userId, issueId });
			revalidatePath('/issues/list');
			revalidatePath(`/issues/${issueId}`);
			return { success: true, isUpvoted: true };
		}
	} catch (error) {
		console.error('Error toggling upvote:', error);
		return {
			success: false,
			isUpvoted: false,
			error: error instanceof Error ? error.message : 'Failed to toggle upvote'
		};
	}
}
