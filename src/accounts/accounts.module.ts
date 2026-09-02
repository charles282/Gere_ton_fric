import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller.js';
import { AccountsService } from './accounts.service.js';
import { RlsContext } from '../db/with-rls-context.js';

@Module({
  controllers: [AccountsController],
  providers: [AccountsService, RlsContext],
})
export class AccountsModule {}
