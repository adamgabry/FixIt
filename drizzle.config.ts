import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/db/schema',
	out: './drizzle',
	dialect: 'turso',
	dbCredentials: {
		url: process.env.DATABASE_URL ?? 'file:./dev.db',
		authToken: process.env.AUTH_TOKEN
	}
});
