import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RlsContext } from '../db/with-rls-context.js';
import { accounts } from '../db/schema/index.js';
import { requestContextStorage } from '../common/request-context/request-context.js';
import type { CreateAccountDto } from './dto/create-account.dto.js';

@Injectable()
export class AccountsService {
  constructor(private readonly rls: RlsContext) {}

  async create(dto: CreateAccountDto) {
    const userId = this.requireUserId();
    return this.rls.run(async (tx) => {
      const [account] = await tx
        .insert(accounts)
        .values({
          userId,
          name: dto.name,
          type: dto.type,
          currency: dto.currency ?? 'EUR',
          balanceCents: BigInt(dto.balanceCents ?? 0),
        })
        .returning();
      return account;
    });
  }

  async findAll() {
    return this.rls.run(async (tx) => {
      // Pas de .where(eq(accounts.userId, userId)) ici par choix : la policy RLS
      // fait déjà l'isolation au niveau Postgres. C'est justement ce que la
      // validation de bout en bout (deux utilisateurs, deux headers) doit prouver.
      return tx.select().from(accounts);
    });
  }

  private requireUserId(): string {
    const userId = requestContextStorage.getStore()?.userId;
    if (!userId) {
      throw new UnauthorizedException('Missing x-debug-user-id header (MVP, pré-authentification)');
    }
    return userId;
  }
}
