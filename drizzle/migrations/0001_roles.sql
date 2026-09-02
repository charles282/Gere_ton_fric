-- Rôle applicatif restreint, distinct du rôle propriétaire des tables (budgetly_migrator).
-- L'application se connecte toujours avec ce rôle : FORCE ROW LEVEL SECURITY (voir 0002)
-- n'a d'effet réel que si ce rôle n'est pas superuser et ne possède pas les tables.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'budgetly_app') THEN
    CREATE ROLE budgetly_app WITH LOGIN PASSWORD 'changeme_app';
  END IF;
END
$$;

GRANT CONNECT ON DATABASE budgetly TO budgetly_app;
GRANT USAGE ON SCHEMA public TO budgetly_app;

GRANT SELECT, INSERT, UPDATE, DELETE ON
  households,
  users,
  bank_connections,
  accounts,
  categories,
  transactions,
  budgets,
  recurring_rules
TO budgetly_app;
