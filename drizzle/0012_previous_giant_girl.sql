ALTER TABLE "client_message" ADD COLUMN "replyToId" varchar(255);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_replyToId_client_message_id_fk" FOREIGN KEY ("replyToId") REFERENCES "public"."client_message"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
