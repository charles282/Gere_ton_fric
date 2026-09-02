import { pgTable, uuid, text, char, bigint, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { users } from './users.schema.js';
import { accountTypeEnum } from './enums.js';
import { bankConnections } from './bank-connections.schema.js';

export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  type: accountTypeEnum('type').notNull(),
  currency: char('currency', { length: 3 }).notNull().default('EUR'),
  balanceCents: bigint('balance_cents', { mode: 'bigint' })
    .notNull()
    .default(sql`0`),
  isManual: boolean('is_manual').notNull().default(true),
  bankConnectionId: uuid('bank_connection_id').references(() => bankConnections.id, {
    onDelete: 'set null',
  }),
});
