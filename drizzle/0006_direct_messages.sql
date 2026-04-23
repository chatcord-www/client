ALTER TABLE "client_message" ADD COLUMN IF NOT EXISTS "direct_owner_id" varchar(255);
ALTER TABLE "client_message" ADD COLUMN IF NOT EXISTS "direct_friend_id" varchar(255);

DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_direct_owner_id_client_user_id_fk" FOREIGN KEY ("direct_owner_id") REFERENCES "public"."client_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "client_message" ADD CONSTRAINT "client_message_direct_friend_id_client_user_id_fk" FOREIGN KEY ("direct_friend_id") REFERENCES "public"."client_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
