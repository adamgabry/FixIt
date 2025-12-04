import { primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

import { users } from '@/db/schema/users';
import { issues } from '@/db/schema/issues';

export const issueLikes = sqliteTable(
	'issueLikes',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id),
		issueId: text('issueId')
			.notNull()
			.references(() => issues.id)
	},
	table => ({
		pk: primaryKey({ columns: [table.userId, table.issueId] })
	})
);

export const issueLikesRelations = relations(issueLikes, ({ one }) => ({
	user: one(users, {
		fields: [issueLikes.userId],
		references: [users.id]
	}),
	issue: one(issues, {
		fields: [issueLikes.issueId],
		references: [issues.id]
	})
}));
