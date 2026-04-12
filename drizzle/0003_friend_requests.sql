CREATE TYPE "friend_request_status" AS ENUM('PENDING', 'ACCEPTED', 'DECLINED');

CREATE TABLE "client_friend_request" (
  "id" varchar(255) PRIMARY KEY NOT NULL,
  "sender_id" varchar(255) NOT NULL,
  "receiver_id" varchar(255) NOT NULL,
  "status" "friend_request_status" DEFAULT 'PENDING' NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "client_friendship" (
  "user_id" varchar(255) NOT NULL,
  "friend_id" varchar(255) NOT NULL,
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "client_friendship_user_id_friend_id_pk" PRIMARY KEY("user_id","friend_id")
);

ALTER TABLE "client_friend_request" ADD CONSTRAINT "client_friend_request_sender_id_client_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."client_user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "client_friend_request" ADD CONSTRAINT "client_friend_request_receiver_id_client_user_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."client_user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "client_friendship" ADD CONSTRAINT "client_friendship_user_id_client_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."client_user"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "client_friendship" ADD CONSTRAINT "client_friendship_friend_id_client_user_id_fk" FOREIGN KEY ("friend_id") REFERENCES "public"."client_user"("id") ON DELETE cascade ON UPDATE no action;

CREATE UNIQUE INDEX "friend_request_sender_receiver_unique" ON "client_friend_request" USING btree ("sender_id", "receiver_id");