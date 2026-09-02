import { Global, Module, type OnModuleDestroy } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { DRIZZLE } from './db.constants.js';
import * as schema from './schema/index.js';

export type Db = NodePgDatabase<typeof schema>;

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: DRIZZLE,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Db => {
        // Rôle applicatif restreint (budgetly_app) : c'est ce qui rend
        // FORCE ROW LEVEL SECURITY réellement effectif — jamais le rôle migrateur.
        const pool = new Pool({
          connectionString: config.getOrThrow<string>('DATABASE_URL'),
        });
        return drizzle(pool, { schema });
      },
    },
  ],
  exports: [DRIZZLE],
})
export class DbModule implements OnModuleDestroy {
  onModuleDestroy(): void {
    // Le pool ferme ses connexions au shutdown du process ; rien de spécifique
    // à faire ici pour le MVP (pas de tracking multi-pool).
  }
}
