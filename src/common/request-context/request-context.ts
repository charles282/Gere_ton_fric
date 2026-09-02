import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContext {
  userId: string | null;
}

export const requestContextStorage = new AsyncLocalStorage<RequestContext>();
