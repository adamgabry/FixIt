'use server';

import type { IssueLikeValuesSchema } from '@/modules/issueLike/schema';
import {
	createLikeFacade,
	updateLikeFacade,
	deleteLikeFacade
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
