import {
	createUser,
	deleteUser,
	getUserById,
	getUsers,
	updateUser
} from '@/modules/user/server';
import { type User } from '@/modules/user/schema';

export const getUsersFacade = async (): Promise<User[]> => getUsers();

export const createUserFacade = async (data: Omit<User, 'id'>) =>
	createUser(data);

export const updateUserFacade = async (id: number, data: Partial<User>) =>
	updateUser(id, data);

export const deleteUserFacade = async (id: number) => deleteUser(id);

export const getUserByIdFacade = async (id: number) => getUserById(id);
