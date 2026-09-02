import { Inject, Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import { DRIZZLE } from './db.constants.js';
import type { Db } from './db.module.js';
import { requestContextStorage } from '../common/request-context/request-context.js';

/**
 * Exécute `fn` dans une transaction Postgres où app.current_user_id est posé
 * via SET LOCAL — jamais SET seul, qui persisterait sur une connexion réutilisée
 * par le pool et fuiterait le contexte d'un utilisateur vers un autre.
 * SET LOCAL est borné à la transaction et s'annule automatiquement au commit/rollback.
 *
 * Convention du projet : aucune requête Drizzle ne doit s'exécuter en dehors de
 * ce wrapper — c'est ce qui garantit que les policies RLS s'appliquent toujours.
 */
@Injectable()
export class RlsContext {
  constructor(@Inject(DRIZZLE) private readonly db: Db) {}

  async run<T>(fn: (tx: Db) => Promise<T>): Promise<T> {
    const ctx = requestContextStorage.getStore();
    const userId = ctx?.userId ?? null;

    return this.db.transaction(async (tx) => {
      // set_config(..., true) est l'équivalent bindable de SET LOCAL : Postgres
      // n'accepte pas de paramètre lié après "SET LOCAL x =", donc on ne peut
      // pas faire `SET LOCAL app.current_user_id = ${userId}` sans concaténer
      // la valeur en clair dans le SQL. set_config évite ce risque d'injection.
      await tx.execute(sql`SELECT set_config('app.current_user_id', ${userId ?? ''}, true)`);
      return fn(tx as unknown as Db);
    });
  }
}
