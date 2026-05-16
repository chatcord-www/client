CREATE TABLE IF NOT EXISTS "client_message_reaction" (
  "message_id" varchar(255) NOT NULL,
  "user_id" varchar(255) NOT NULL,
  "emoji" varchar(64) NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "client_message_reaction_message_id_user_id_emoji_pk" PRIMARY KEY("message_id","user_id","emoji")
);

DO $$ BEGIN
 ALTER TABLE "client_message_reaction" ADD CONSTRAINT "client_message_reaction_message_id_client_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."client_message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "client_message_reaction" ADD CONSTRAINT "client_message_reaction_user_id_client_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."client_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
