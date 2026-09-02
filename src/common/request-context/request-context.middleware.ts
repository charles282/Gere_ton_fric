import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { requestContextStorage } from './request-context.js';

/**
 * MVP sans authentification : le user_id vient d'un header de dev
 * (x-debug-user-id) ou, à défaut, de DEFAULT_DEV_USER_ID.
 * À remplacer par l'extraction depuis la session/JWT en phase 2.
 */
@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    const headerUserId = req.header('x-debug-user-id');
    const userId = headerUserId ?? process.env.DEFAULT_DEV_USER_ID ?? null;

    requestContextStorage.run({ userId: userId || null }, () => next());
  }
}
