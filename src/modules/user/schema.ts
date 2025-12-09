import { z } from 'zod';

export enum Role {
	ADMIN = 'admin',
	STAFF = 'staff',
	USER = 'user'
}

export const ROLE_VALUES = Object.values(Role) as [Role, ...Role[]];

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.email(),
	image: z.string().nullish(),
	role: z.enum(ROLE_VALUES)
});

export type User = z.infer<typeof userSchema>;
