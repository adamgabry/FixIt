'use server';

import {
	createUserFacade,
	deleteUserFacade,
	updateUserFacade
} from '@/modules/user/facade';

import { type User } from './schema';

export const createUserAction = async (data: Omit<User, 'id'>) =>
	createUserFacade(data);

export const updateUserAction = async (id: number, data: Partial<User>) =>
	updateUserFacade(id, data);

export const deleteUserAction = async (id: number) => deleteUserFacade(id);
