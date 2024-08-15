CREATE TABLE IF NOT EXISTS "client_message" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"content" varchar(1024) NOT NULL,
	"userId" varchar,
	"serverId" varchar,
	"channelId" varchar
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_userId_client_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."client_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_serverId_client_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."client_server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_channelId_client_channel_id_fk" FOREIGN KEY ("channelId") REFERENCES "public"."client_channel"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
