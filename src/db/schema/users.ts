import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

import { issues } from '@/db/schema/issues';
import { issueLikes } from '@/db/schema/likes';

export const roleValues = ['user', 'staff', 'admin'] as const;

export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	name: text('name').notNull(),
	email: text('email').notNull(),
	password: text('password').notNull(),
	role: text('role', { enum: roleValues }).notNull()
});

export const usersRelations = relations(users, ({ many }) => ({
	issues: many(issues),
	likes: many(issueLikes)
}));
