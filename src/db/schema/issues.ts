import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { type InferSelectModel, relations } from 'drizzle-orm';

import { users } from '@/db/schema/users';
import { ISSUE_STATUS_VALUES, ISSUE_TYPE_VALUES } from '@/modules/issue/schema';
import { issuePictures } from '@/db/schema/issue-pictures';
import { issueLikes } from '@/db/schema/likes';

export const issues = sqliteTable('issues', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	title: text('title').notNull(),
	description: text('description').notNull(),
	latitude: real('latitude').notNull(),
	longitude: real('longitude').notNull(),
	status: text('status', { enum: ISSUE_STATUS_VALUES }).notNull(),
	type: text('type', { enum: ISSUE_TYPE_VALUES }).notNull(),
	createdAt: integer('createdAt').notNull(),
	updatedAt: integer('updatedAt').notNull(),
	reporterId: integer('reporterId')
		.notNull()
		.references(() => users.id)
});

export const issuesRelations = relations(issues, ({ one, many }) => ({
	reporter: one(users, {
		fields: [issues.reporterId],
		references: [users.id]
	}),
	likes: many(issueLikes),
	pictures: many(issuePictures)
}));

export type IssueRow = InferSelectModel<typeof issues>;

export type IssueStatusRow = IssueRow['status'];
export type IssueTypeRow = IssueRow['type'];
