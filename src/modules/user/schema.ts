import { z } from 'zod';

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	image: z.string().nullable(),
	role: z.enum(['admin', 'staff', 'user']),
	//TODO: change to date and add mapping
	createdAt: z.number(),
	updatedAt: z.number()
});

export type User = z.infer<typeof userSchema>;

export const updateUserRoleSchema = z.object({
	userId: z.string(),
	role: z.enum(['admin', 'staff', 'user'])
});

export type UpdateUserValues = z.infer<typeof updateUserRoleSchema>;
