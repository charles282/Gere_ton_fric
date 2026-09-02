import { pgTable, uuid, bigint, date } from 'drizzle-orm/pg-core';
import { accounts } from './accounts.schema.js';
import { categories } from './categories.schema.js';
import { recurringFrequencyEnum } from './enums.js';

export const recurringRules = pgTable('recurring_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id')
    .notNull()
    .references(() => categories.id, { onDelete: 'restrict' }),
  amountCents: bigint('amount_cents', { mode: 'bigint' }).notNull(),
  frequency: recurringFrequencyEnum('frequency').notNull(),
  nextOccurrence: date('next_occurrence', { mode: 'string' }).notNull(),
});
