('server-only');

import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import { users, usersRelations } from '@/db/schema/users';
import { issueLikes, issueLikesRelations } from '@/db/schema/likes';
import { issues, issuesRelations } from '@/db/schema/issues';
import {
	issuePictures,
	issuePicturesRelations
} from '@/db/schema/issue-pictures';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL is not set');
}

const client = createClient({
	url: process.env.DATABASE_URL,
	authToken: process.env.AUTH_TOKEN
});

export const db = drizzle(client, {
	schema: {
		users,
		issues,
		issueLikes,
		issuePictures,
		// relations
		usersRelations,
		issuesRelations,
		issueLikesRelations,
		issuePicturesRelations
	}
});
