import fs from 'node:fs/promises';
import path from 'node:path';
import { createSeedDatabase } from '../data/seed.js';
import { getTableConfig } from '../data/table-config.js';

const clone = (value) => structuredClone(value);

export class JsonStore {
  constructor(filePath) {
    this.filePath = filePath;
    this.database = null;
    this.mutationQueue = Promise.resolve();
  }

  async init() {
    await fs.mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      this.database = JSON.parse(await fs.readFile(this.filePath, 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
      this.database = createSeedDatabase();
      await this.persist();
    }
    return this;
  }

  snapshot() {
    return clone(this.database);
  }

  table(tableName, allowInternal = false) {
    if (!getTableConfig(tableName, allowInternal)) {
      throw Object.assign(new Error(`不支持的数据表: ${tableName}`), { statusCode: 404 });
    }
    return clone(this.database[tableName] || []);
  }

  async mutate(operation) {
    const execute = async () => {
      const draft = clone(this.database);
      const result = await operation(draft);
      this.database = draft;
      await this.persist();
      return clone(result);
    };
    const promise = this.mutationQueue.then(execute, execute);
    this.mutationQueue = promise.catch(() => undefined);
    return promise;
  }

  async reset() {
    return this.mutate((draft) => {
      const seed = createSeedDatabase();
      for (const key of Object.keys(draft)) delete draft[key];
      Object.assign(draft, seed);
      return { reset: true };
    });
  }

  async persist() {
    const tempFile = `${this.filePath}.tmp`;
    await fs.writeFile(tempFile, `${JSON.stringify(this.database, null, 2)}\n`, 'utf8');
    await fs.rename(tempFile, this.filePath);
  }
}

export function createId(tableName, rows, config = getTableConfig(tableName, true)) {
  if (!config) throw new Error(`缺少数据表配置: ${tableName}`);
  const { primaryKey, prefix, width = 3 } = config;
  const max = rows.reduce((current, row) => {
    const raw = row[primaryKey];
    const numeric = prefix ? Number(String(raw || '').replace(/\D/g, '')) : Number(raw);
    return Math.max(current, Number.isFinite(numeric) ? numeric : 0);
  }, 0);
  const next = max + 1;
  return prefix ? `${prefix}${String(next).padStart(width, '0')}` : next;
}

