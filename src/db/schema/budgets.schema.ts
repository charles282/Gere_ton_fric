import { pgTable, uuid, bigint, date } from 'drizzle-orm/pg-core';
import { users } from './users.schema.js';
import { categories } from './categories.schema.js';
import { budgetPeriodEnum } from './enums.js';

export const budgets = pgTable('budgets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  period: budgetPeriodEnum('period').notNull(),
  limitCents: bigint('limit_cents', { mode: 'bigint' }).notNull(),
  startsOn: date('starts_on', { mode: 'string' }).notNull(),
});
