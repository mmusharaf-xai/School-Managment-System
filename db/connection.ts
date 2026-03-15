import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

let db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export const getDb = () => {
  if (!db) {
    const sqlite = openDatabaseSync('school-management-system.db');
    db = drizzle(sqlite, { schema });
  }
  return db;
};

export const initDb = async () => {
  const database = getDb();
   
  return database;
};
