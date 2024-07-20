DO $$ BEGIN
 CREATE TYPE "public"."activity" AS ENUM('ONLINE', 'IDLE', 'DND', 'OFFLINE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_account" (
	"userId" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"providerAccountId" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255),
	CONSTRAINT "client_account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_server" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"icon" varchar(255),
	"public" boolean DEFAULT false,
	"ownerId" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_session" (
	"sessionToken" varchar(255) PRIMARY KEY NOT NULL,
	"userId" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"emailVerified" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
	"image" varchar(255),
	"discriminator" varchar(4),
	"activity" "activity" DEFAULT 'ONLINE',
	"about_me" varchar(255),
	"status" json,
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_users_to_servers" (
	"userId" varchar(255) NOT NULL,
	"serverId" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "client_verificationToken" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp with time zone NOT NULL,
	CONSTRAINT "client_verificationToken_identifier_token_pk" PRIMARY KEY("identifier","token")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_account" ADD CONSTRAINT "client_account_userId_client_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."client_user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_server" ADD CONSTRAINT "client_server_ownerId_client_user_id_fk" FOREIGN KEY ("ownerId") REFERENCES "public"."client_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_session" ADD CONSTRAINT "client_session_userId_client_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."client_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_users_to_servers" ADD CONSTRAINT "client_users_to_servers_userId_client_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."client_user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "client_users_to_servers" ADD CONSTRAINT "client_users_to_servers_serverId_client_server_id_fk" FOREIGN KEY ("serverId") REFERENCES "public"."client_server"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "client_account" ("userId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "client_session" ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "unique_user_discriminator" ON "client_user" ("name","discriminator");