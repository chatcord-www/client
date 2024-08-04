ALTER TABLE "client_category" ADD COLUMN "serverId" varchar(255);--> statement-breakpoint
ALTER TABLE "client_channel" ADD COLUMN "serverId" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_category" ADD CONSTRAINT "client_category_serverId_client_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."client_server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_channel" ADD CONSTRAINT "client_channel_serverId_client_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."client_server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
