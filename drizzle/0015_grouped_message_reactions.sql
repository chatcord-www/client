ALTER TABLE "client_message_reaction" RENAME TO "client_message_reaction_legacy";
--> statement-breakpoint
CREATE TABLE "client_message_reaction" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"message_id" varchar(255) NOT NULL,
	"emoji" varchar(64) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE "client_message_reaction_user" (
	"reaction_id" varchar(255) NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	CONSTRAINT "client_message_reaction_user_reaction_id_user_id_pk" PRIMARY KEY("reaction_id","user_id")
);
--> statement-breakpoint
CREATE UNIQUE INDEX "message_reaction_message_emoji_unique" ON "client_message_reaction" USING btree ("message_id","emoji");
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message_reaction" ADD CONSTRAINT "client_message_reaction_message_id_client_message_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."client_message"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message_reaction_user" ADD CONSTRAINT "client_message_reaction_user_reaction_id_client_message_reaction_id_fk" FOREIGN KEY ("reaction_id") REFERENCES "public"."client_message_reaction"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_message_reaction_user" ADD CONSTRAINT "client_message_reaction_user_user_id_client_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."client_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
INSERT INTO "client_message_reaction" ("id", "message_id", "emoji", "created_at")
SELECT
	md5("message_id" || ':' || "emoji") AS "id",
	"message_id",
	"emoji",
	MIN("created_at") AS "created_at"
FROM "client_message_reaction_legacy"
GROUP BY "message_id", "emoji";
--> statement-breakpoint
INSERT INTO "client_message_reaction_user" ("reaction_id", "user_id", "created_at")
SELECT
	md5("message_id" || ':' || "emoji") AS "reaction_id",
	"user_id",
	"created_at"
FROM "client_message_reaction_legacy";
--> statement-breakpoint
DROP TABLE "client_message_reaction_legacy";