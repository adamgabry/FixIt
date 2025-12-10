'use server';

import { revalidatePath } from 'next/cache';

import {
	createLikeFacade,
	deleteLikeFacade,
	getLikeByUserAndIssueFacade
} from '@/modules/issueLike/facade';

export const toggleUpvoteAction = async (
	issueId: number,
	userId: string
): Promise<{ success: boolean; isUpvoted: boolean; error?: string }> => {
	try {
		const existingLike = await getLikeByUserAndIssueFacade(userId, issueId);

		// if existing -> remove upvote otherwise add
		if (existingLike) {
			await deleteLikeFacade(userId, issueId);
			revalidatePath('/issues/list');
			revalidatePath(`/issues/${issueId}`);
			return { success: true, isUpvoted: false };
		} else {
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
};
