CREATE TABLE IF NOT EXISTS "client_category" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_channel" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"category_id" varchar(255)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_channel" ADD CONSTRAINT "client_channel_category_id_client_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."client_category"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
