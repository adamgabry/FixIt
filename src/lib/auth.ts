import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

import { db } from '@/db';
import { ROLE_VALUES } from '@/modules/user/schema';

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite'
	}),
	socialProviders: {
		github: {
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!
		}
	},
	secret: process.env.BETTER_AUTH_SECRET!,
	baseURL: process.env.NEXT_PUBLIC_APP_URL!,
	user: {
		additionalFields: {
			role: {
				type: 'string',
				enum: ROLE_VALUES,
				defaultValue: 'user',
				input: false
			}
		}
	}
});
