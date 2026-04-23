ALTER TABLE "client_message" DROP CONSTRAINT "client_message_ownerId_client_user_id_fk";
--> statement-breakpoint
ALTER TABLE "client_message" ALTER COLUMN "userId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "client_message" DROP COLUMN IF EXISTS "ownerId";