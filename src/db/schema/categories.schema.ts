import { pgTable, uuid, text, type AnyPgColumn } from 'drizzle-orm/pg-core';
import { users } from './users.schema.js';
import { categoryKindEnum } from './enums.js';

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  // nullable = catégorie par défaut, partagée entre tous les utilisateurs
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  icon: text('icon'),
  parentId: uuid('parent_id').references((): AnyPgColumn => categories.id, {
    onDelete: 'set null',
  }),
  kind: categoryKindEnum('kind').notNull(),
});
