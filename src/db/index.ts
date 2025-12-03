'server-only';

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import * as schema from './schema';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const client = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.AUTH_TOKEN
});

export const db = drizzle(client, {
	schema: {
		users: schema.users,
		issues: schema.issues,
		likes: schema.likes,
		// relations
		usersRelations: schema.usersRelations,
		issuesRelations: schema.issuesRelations,
		likesRelations: schema.likesRelations,
	}
});
