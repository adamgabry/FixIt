import { z } from 'zod';

export const userSchema = z.object({
	id: z.number(),
	name: z.string(),
	email: z.string().email().min(1),
	password: z.string().min(1),
	role: z.enum(['ADMIN', 'STAFF', 'USER'])
});

export type User = z.infer<typeof userSchema>;
