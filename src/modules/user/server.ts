import { promises as fs } from 'fs';
import path from 'path';

import { z } from 'zod';

import { type User, userSchema } from '@/modules/user/schema';

const FILE_PATH = path.join(process.cwd(), 'users.json');
const SLEEP_TIME_MS = 1500;

const sleep = () => new Promise(resolve => setTimeout(resolve, SLEEP_TIME_MS));

const parseUsers = (input: string) =>
	z.array(userSchema).parse(JSON.parse(input || '[]'));

const safeRead = async () => {
	try {
		const file = await fs.readFile(FILE_PATH, 'utf8');
		return parseUsers(file);
	} catch {
		return [];
	}
};

export const getUsers = async () => {
	await sleep();
	return safeRead();
};

export const createUser = async (data: Omit<User, 'id'>) => {
	const users = await safeRead();

	const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

	const newUser: User = {
		id: nextId,
		...data
	};

	const validated = userSchema.parse(newUser);

	await fs.writeFile(FILE_PATH, JSON.stringify([...users, validated], null, 2));
	await sleep();

	return validated;
};

export const updateUser = async (id: number, data: Partial<User>) => {
	const users = await safeRead();

	const existing = users.find(u => u.id === id);
	if (!existing) throw new Error(`User with id ${id} not found.`);

	const updated = userSchema.parse({ ...existing, ...data });

	const newUsers = users.map(u => (u.id === id ? updated : u));

	await fs.writeFile(FILE_PATH, JSON.stringify(newUsers, null, 2));
	await sleep();

	return updated;
};

export const deleteUser = async (id: number) => {
	const users = await safeRead();
	const newUsers = users.filter(u => u.id !== id);

	await fs.writeFile(FILE_PATH, JSON.stringify(newUsers, null, 2));
	await sleep();

	return newUsers;
};
