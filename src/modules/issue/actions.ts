'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

import { type Issue, type IssueValuesSchema, IssueStatus } from '@/modules/issue/schema';
import {
	createIssueFacade,
	deleteIssueFacade,
	updateIssueFacade
} from '@/modules/issue/facade';
import { requireAuth } from '@/modules/auth/server';
import { createIssueFormSchema } from '@/modules/issue/components/create-issue-form/schema';
import { updateIssueFormSchema } from '@/modules/issue/components/update-issue-form/schema';

type CreateIssueActionState = {
	error?: string;
	success?: boolean;
	issue?: Issue | null;
} | null;

export const createIssueAction = async (
	_prevState: CreateIssueActionState,
	formData: FormData
) => {
	try {
		const session = await requireAuth();

		const title = formData.get('title');
		const description = formData.get('description');
		const type = formData.get('type');
		const latitude = formData.get('latitude');
		const longitude = formData.get('longitude');
		const pictures = formData.getAll('pictures');

		const data = createIssueFormSchema.parse({
			title,
			description,
			type,
			latitude,
			longitude
		});

		const issueData: IssueValuesSchema = {
			title: data.title,
			description: data.description,
			type: data.type,
			status: IssueStatus.REPORTED,
			latitude: data.latitude,
			longitude: data.longitude,
			pictures: pictures.filter((p): p is string => typeof p === 'string' && p.length > 0),
			reporterId: session.user.id
		};

		const issue = await createIssueFacade(issueData);

		revalidatePath('/');
		revalidatePath('/issues/list');

		return { success: true, issue };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: 'Invalid form data'
			};
		}

		return {
			error: error instanceof Error ? error.message : 'Something went wrong'
		};
	}
};

type UpdateIssueActionState = {
	error?: string;
	success?: boolean;
	issue?: Issue | null;
} | null;

export const updateIssueAction = async (
	_prevState: UpdateIssueActionState,
	formData: FormData
) => {
	try {
		await requireAuth();

		const id = formData.get('id');
		const title = formData.get('title');
		const description = formData.get('description');
		const type = formData.get('type');
		const status = formData.get('status');
		const latitude = formData.get('latitude');
		const longitude = formData.get('longitude');
		const pictures = formData.getAll('pictures');
		const reporterId = formData.get('reporterId');

		if (!id || !reporterId) {
			return {
				error: 'Missing required fields'
			};
		}

		const data = updateIssueFormSchema.parse({
			title,
			description,
			type,
			status,
			latitude,
			longitude
		});

		const issueData: IssueValuesSchema = {
			title: data.title,
			description: data.description,
			type: data.type,
			status: data.status,
			latitude: data.latitude,
			longitude: data.longitude,
			pictures: pictures.filter((p): p is string => typeof p === 'string' && p.length > 0),
			reporterId: reporterId.toString()
		};

		const issue = await updateIssueFacade(Number(id), issueData);

		revalidatePath(`/issues/${id}`);
		revalidatePath('/');
		revalidatePath('/issues/list');

		return { success: true, issue };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: 'Invalid form data'
			};
		}

		return {
			error: error instanceof Error ? error.message : 'Something went wrong'
		};
	}
};

export const deleteIssueAction = async (id: number) => {
	await requireAuth();
	await deleteIssueFacade(id);
	revalidatePath('/');
	revalidatePath('/issues/list');
};
