import { pgEnum } from 'drizzle-orm/pg-core';

export const accountTypeEnum = pgEnum('account_type', [
  'checking',
  'savings',
  'cash',
  'credit_card',
  'investment',
  'other',
]);

export const categoryKindEnum = pgEnum('category_kind', ['income', 'expense']);

export const transactionSourceEnum = pgEnum('transaction_source', [
  'manual',
  'import',
  'bank_sync',
  'recurring',
]);

export const budgetPeriodEnum = pgEnum('budget_period', ['monthly', 'weekly', 'yearly']);

export const bankConnectionProviderEnum = pgEnum('bank_connection_provider', [
  'powens',
  'bridge',
]);

export const bankConnectionStatusEnum = pgEnum('bank_connection_status', [
  'active',
  'requires_reauth',
  'error',
  'disconnected',
]);

export const recurringFrequencyEnum = pgEnum('recurring_frequency', [
  'daily',
  'weekly',
  'monthly',
  'yearly',
]);
