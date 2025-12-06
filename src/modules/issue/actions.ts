'use server';

import { type IssueValuesSchema } from '@/modules/issue/schema';
import {
	createIssueFacade,
	deleteIssueFacade,
	updateIssueFacade
} from '@/modules/issue/facade';

export const createIssueAction = async (data: IssueValuesSchema) =>
	createIssueFacade(data);

export const updateIssueAction = async (
	id: number,
	data: Partial<IssueValuesSchema>
) => updateIssueFacade(id, data);

export const deleteIssueAction = async (id: number) => deleteIssueFacade(id);
