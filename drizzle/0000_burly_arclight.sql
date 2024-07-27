CREATE TABLE IF NOT EXISTS "monitors" (
	"name" text PRIMARY KEY NOT NULL,
	"url" text,
	"method" varchar(10),
	"requestTime" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "stats" (
	"url" text PRIMARY KEY NOT NULL,
	"latency" double precision NOT NULL,
	"status" boolean,
	"time1" time
);
