import { relations } from 'drizzle-orm';
import { integer, primaryKey, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { z } from 'zod';
import { IssueStatus, IssueType } from '@/modules/issue/schema';

const roleValues = ['user', 'staff', 'admin'] as const;
const roleSchema = z.enum(roleValues);

const statusValues = Object.values(IssueStatus) as [IssueStatus, ...IssueStatus[]];
const statusSchema = z.enum(statusValues);

const typeValues = Object.values(IssueType) as [IssueType, ...IssueType[]];
const typeSchema = z.enum(typeValues);

export const users = sqliteTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	username: text('username').notNull(),
	password: text('password').notNull(),
	role: text('role', { enum: roleValues }).notNull(),
	isLoggedIn: integer('isLoggedIn', { mode: 'boolean' })
		.notNull()
		.default(false),
});

export const issues = sqliteTable('issues', {
	id: text('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	latitude: real('latitude').notNull(),
	longitude: real('longitude').notNull(),
	status: text('status', { enum: statusValues }).notNull(),
	type: text('type', { enum: typeValues }).notNull(),
	pictures: text('pictures', { mode: 'json' }).$type<string[]>().notNull(),
	createdBy: text('createdBy')
		.notNull()
		.references(() => users.id),
});

export const likes = sqliteTable('likes', {
	userId: text('userId')
	  .notNull()
	  .references(() => users.id),
	issueId: text('issueId')
	  .notNull()
	  .references(() => issues.id),
  }, (table) => ({
	pk: primaryKey({ columns: [table.userId, table.issueId] }), // one like per user+issue
  }));

export const usersRelations = relations(users, ({ many }) => ({
	issues: many(issues),
	likes: many(likes),
}));

export const issuesRelations = relations(issues, ({ one, many }) => ({
	creator: one(users, {
		fields: [issues.createdBy],
		references: [users.id]
	}),
	likes: many(likes), 
}));

export const likesRelations = relations(likes, ({ one }) => ({
	user: one(users, {
	  fields: [likes.userId],
	  references: [users.id],
	}),
	issue: one(issues, {
	  fields: [likes.issueId],
	  references: [issues.id],
	}),
  }));