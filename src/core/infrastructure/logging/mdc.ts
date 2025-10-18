import { AsyncLocalStorage } from 'node:async_hooks';

export interface MDCContext {
  requestId?: string;
  userId?: string;
  sessionId?: string;
  correlationId?: string;
  method?: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  [key: string]: any;
}

class MDC {
  private static storage = new AsyncLocalStorage<MDCContext>();

  /**
   * Run a function with MDC context
   */
  static run<T>(context: MDCContext, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  /**
   * Get the current MDC context
   */
  static getContext(): MDCContext {
    return this.storage.getStore() || {};
  }

  /**
   * Set a value in the current MDC context
   */
  static set(key: string, value: any): void {
    const store = this.storage.getStore();
    if (store) {
      store[key] = value;
    }
  }

  /**
   * Get a value from the current MDC context
   */
  static get(key: string): any {
    const store = this.storage.getStore();
    return store?.[key];
  }

  /**
   * Clear a value from the current MDC context
   */
  static remove(key: string): void {
    const store = this.storage.getStore();
    if (store) {
      delete store[key];
    }
  }

  /**
   * Clear all MDC context
   */
  static clear(): void {
    const store = this.storage.getStore();
    if (store) {
      Object.keys(store).forEach(key => delete store[key]);
    }
  }
}

export default MDC;
