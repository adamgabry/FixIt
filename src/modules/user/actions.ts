'use server';

import { updateUserFacade } from '@/modules/user/facade';

import { type UpdateUserValues } from './schema';

export const updateUserAction = async (id: string, data: UpdateUserValues) =>
	updateUserFacade(id, data);
