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
	email: z.string().email(),
	emailVerified: z.boolean(),
	image: z.string().nullish(),
	role: z.enum(ROLE_VALUES),
	//TODO: map to date
	createdAt: z.number(),
	updatedAt: z.number()
});

export type User = z.infer<typeof userSchema>;
