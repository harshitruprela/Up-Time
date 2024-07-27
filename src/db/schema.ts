/** @format */

import { pgTable, serial, text, doublePrecision, varchar, boolean, time, integer, timestamp } from 'drizzle-orm/pg-core';

// Define the monitors table
export const monitors = pgTable('monitors', {
  name: text('name').primaryKey(),
  url: text('url').notNull(),
  method: varchar('method', { length: 10 }),
  requestTime: integer('requestTime').notNull(),
});

// Define the stats table
export const stats = pgTable('stats', {
  id: serial('id').primaryKey(),
  statsUrl: text('stats_url').notNull(),
  latency: doublePrecision('latency').notNull(),
  status: boolean('status'),
  time: timestamp('time',{mode : 'string',withTimezone : false}),
});

