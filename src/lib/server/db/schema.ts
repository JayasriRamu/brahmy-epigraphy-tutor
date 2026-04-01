import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const inscriptions = sqliteTable('inscriptions', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name').notNull(),
	scriptType: text('script_type', { enum: ['Brahmi', 'Vatteluttu'] }).notNull(),
	content: text('content').notNull(),
	translation: text('translation')
});
