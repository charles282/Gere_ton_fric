-- Fonction utilitaire : lit le user_id du contexte de session (posé par SET LOCAL
-- app.current_user_id dans chaque transaction applicative), NULL si absent.
-- STABLE : peut être mise en cache par le planificateur pour la durée d'une requête.
CREATE OR REPLACE FUNCTION current_app_user_id() RETURNS uuid AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::uuid;
$$ LANGUAGE sql STABLE;

-- accounts : isolation directe par user_id
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts FORCE ROW LEVEL SECURITY;
CREATE POLICY accounts_isolation ON accounts
  USING (user_id = current_app_user_id())
  WITH CHECK (user_id = current_app_user_id());

-- budgets : isolation directe par user_id
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets FORCE ROW LEVEL SECURITY;
CREATE POLICY budgets_isolation ON budgets
  USING (user_id = current_app_user_id())
  WITH CHECK (user_id = current_app_user_id());

-- categories : user_id NULL = catégorie par défaut, partagée et visible par tous
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories FORCE ROW LEVEL SECURITY;
CREATE POLICY categories_isolation ON categories
  USING (user_id IS NULL OR user_id = current_app_user_id())
  WITH CHECK (user_id IS NULL OR user_id = current_app_user_id());

-- transactions : pas de user_id direct, isolation via la jointure account_id -> accounts.user_id
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions FORCE ROW LEVEL SECURITY;
CREATE POLICY transactions_isolation ON transactions
  USING (
    account_id IN (SELECT id FROM accounts WHERE user_id = current_app_user_id())
  )
  WITH CHECK (
    account_id IN (SELECT id FROM accounts WHERE user_id = current_app_user_id())
  );

-- bank_connections : isolation directe par user_id (schéma préparé pour la phase 3)
ALTER TABLE bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_connections FORCE ROW LEVEL SECURITY;
CREATE POLICY bank_connections_isolation ON bank_connections
  USING (user_id = current_app_user_id())
  WITH CHECK (user_id = current_app_user_id());
