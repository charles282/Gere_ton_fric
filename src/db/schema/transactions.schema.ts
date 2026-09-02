import { pgTable, uuid, bigint, date, text, boolean } from 'drizzle-orm/pg-core';
import { accounts } from './accounts.schema.js';
import { categories } from './categories.schema.js';
import { transactionSourceEnum } from './enums.js';

export const transactions = pgTable('transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  accountId: uuid('account_id')
    .notNull()
    .references(() => accounts.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').references(() => categories.id, { onDelete: 'set null' }),
  amountCents: bigint('amount_cents', { mode: 'bigint' }).notNull(),
  occurredAt: date('occurred_at', { mode: 'string' }).notNull(),
  note: text('note'),
  isRecurring: boolean('is_recurring').notNull().default(false),
  source: transactionSourceEnum('source').notNull().default('manual'),
  externalId: text('external_id'),
});
