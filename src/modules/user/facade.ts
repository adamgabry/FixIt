import { getUserById, getUsers, updateUser } from '@/modules/user/server';
import { type Role, type User } from '@/modules/user/schema';
import { type UserRow } from '@/db/schema/users';

const mapUserRowToUser = (userRow: UserRow): User => ({
	id: userRow.id,
	name: userRow.name,
	email: userRow.email,
	image: userRow.image,
	role: userRow.role
});

export const getUsersFacade = async () => {
	const users = await getUsers();
	if (users.length === 0) {
		return [];
	}

	return users.map(mapUserRowToUser);
};

export const getUserByIdFacade = async (id: string) => {
	const userRow = await getUserById(id);
	if (!userRow) {
		return null;
	}
	return mapUserRowToUser(userRow);
};

export const updateUserFacade = async (id: string, role: Role) =>
	updateUser(id, role);
