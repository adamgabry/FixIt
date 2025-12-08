import { getUserById, getUsers, updateUser } from '@/modules/user/server';
import { type Role } from '@/modules/user/schema';

export const getUsersFacade = async () => getUsers();

export const getUserByIdFacade = async (id: string) => getUserById(id);

export const updateUserFacade = async (id: string, role: Role) =>
	updateUser(id, role);
