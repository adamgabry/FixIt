import { eq } from 'drizzle-orm';

import { type User, userSchema } from '@/modules/user/schema';
import { db } from '@/db';
import { users } from '@/db/schema/users';

export const getUsers = async () => {
	return db.select().from(users);
};

export const getUserById = async (id: number) => {
	const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
	return rows.length > 0 ? rows[0] : null;
};

export const createUser = async (data: Omit<User, 'id'>) => {
	const validated = userSchema.omit({ id: true }).parse(data);

	const result = await db.insert(users).values(validated).returning();

	return result[0];
};

export const updateUser = async (id: number, data: Partial<User>) => {
	const validated = userSchema.partial().parse(data);

	const result = await db
		.update(users)
		.set(validated)
		.where(eq(users.id, id))
		.returning();

	if (result.length === 0) {
		throw new Error(`User with id ${id} not found.`);
	}

	return result[0];
};

export const deleteUser = async (id: number) => {
	await db.delete(users).where(eq(users.id, id));
};
