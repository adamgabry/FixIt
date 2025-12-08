import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

import { issues } from '@/db/schema/issues';
import { issueLikes } from '@/db/schema/likes';
import { Role, ROLE_VALUES } from '@/modules/user/schema';

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: integer('email_verified', { mode: 'boolean' })
		.notNull()
		.default(false),
	image: text('image'),
	role: text('role', { enum: ROLE_VALUES })
		.notNull()
		.default(Role.USER)
		.notNull(),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	issues: many(issues),
	likes: many(issueLikes)
}));

// these are Better Auth required tables
export const sessions = sqliteTable('sessions', {
	id: text('id').primaryKey(),
	expiresAt: integer('expires_at').notNull(),
	token: text('token').notNull().unique(),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	userId: text('user_id')
		.notNull()
		.references(() => users.id)
});

export const accounts = sqliteTable('accounts', {
	id: text('id').primaryKey(),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	idToken: text('id_token'),
	accessTokenExpiresAt: integer('access_token_expires_at'),
	refreshTokenExpiresAt: integer('refresh_token_expires_at'),
	scope: text('scope'),
	password: text('password'),
	createdAt: integer('created_at').notNull(),
	updatedAt: integer('updated_at').notNull()
});

export const verifications = sqliteTable('verifications', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: integer('expires_at').notNull(),
	createdAt: integer('created_at'),
	updatedAt: integer('updated_at')
});
