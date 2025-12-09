'use server';

import { type IssueValuesSchema } from '@/modules/issue/schema';
import {
	createIssueFacade,
	deleteIssueFacade,
	updateIssueFacade
} from '@/modules/issue/facade';
import { requireAuth } from '@/modules/auth/server';

export const createIssueAction = async (data: IssueValuesSchema) => {
	await requireAuth();
	return createIssueFacade(data);
};

//TODO: move ownerships checks to action?
export const updateIssueAction = async (
	id: number,
	data: Partial<IssueValuesSchema>
) => {
	await requireAuth();
	return updateIssueFacade(id, data);
};

export const deleteIssueAction = async (id: number) => {
	await requireAuth();
	return deleteIssueFacade(id);
};
