export class Database<T, K extends string | number = string> {
  private store: Map<string, T> = new Map();

  private getKeyString(key: K): string {
    return String(key);
  }

  save(entity: T & { id: K }): void {
    this.store.set(this.getKeyString(entity.id), entity);
  }

  findByKey(key: K): T | null {
    return this.store.get(this.getKeyString(key)) ?? null;
  }

  findAll(): T[] {
    return Array.from(this.store.values());
  }

  // Partial-based search methods
  findOne(criteria: Partial<T>): T | null {
    for (const entity of this.store.values()) {
      if (this.matchesCriteria(entity, criteria)) {
        return entity;
      }
    }
    return null;
  }

  findMany(criteria: Partial<T>): T[] {
    const results: T[] = [];
    for (const entity of this.store.values()) {
      if (this.matchesCriteria(entity, criteria)) {
        results.push(entity);
      }
    }
    return results;
  }

  private matchesCriteria(entity: T, criteria: Partial<T>): boolean {
    for (const key in criteria) {
      if (criteria.hasOwnProperty(key) && entity[key] !== criteria[key]) {
        return false;
      }
    }
    return true;
  }

  update(key: K, updates: Partial<T>): T | null {
    const keyString = this.getKeyString(key);
    const existing = this.store.get(keyString);
    if (!existing) {
      return null;
    }

    const updated = { ...existing, ...updates } as T;
    this.store.set(keyString, updated);
    return updated;
  }

  delete(key: K): boolean {
    return this.store.delete(this.getKeyString(key));
  }

  exists(key: K): boolean {
    return this.store.has(this.getKeyString(key));
  }

  count(): number {
    return this.store.size;
  }

  clear(): void {
    this.store.clear();
  }
}