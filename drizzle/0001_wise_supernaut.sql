ALTER TABLE "client_account" DROP CONSTRAINT "client_account_userId_client_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_account" ADD CONSTRAINT "client_account_userId_client_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."client_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
