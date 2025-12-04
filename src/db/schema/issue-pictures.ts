import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

import { issues } from '@/db/schema/issues';

export const issuePictures = sqliteTable('issuePictures', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	url: text('url'),
	issueId: integer('issueId')
		.notNull()
		.references(() => issues.id)
});

export const issuePicturesRelations = relations(issuePictures, ({ one }) => ({
	issue: one(issues, {
		fields: [issuePictures.issueId],
		references: [issues.id]
	})
}));
