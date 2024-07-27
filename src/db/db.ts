import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// Bun automatically loads the DATABASE_URL from .env.local
// Refer to: https://bun.sh/docs/runtime/env for more information
export const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, {schema});