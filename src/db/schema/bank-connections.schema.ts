import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.schema.js';
import { bankConnectionProviderEnum, bankConnectionStatusEnum } from './enums.js';

export const bankConnections = pgTable('bank_connections', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  provider: bankConnectionProviderEnum('provider').notNull(),
  providerItemId: text('provider_item_id').notNull(),
  status: bankConnectionStatusEnum('status').notNull().default('active'),
  lastSyncedAt: timestamp('last_synced_at', { withTimezone: true }),
});
