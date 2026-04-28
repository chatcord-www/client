-- Add replyToId field to message table
ALTER TABLE "message" ADD COLUMN "replyToId" varchar(255);

-- Add foreign key constraint
ALTER TABLE "message" ADD CONSTRAINT "message_replyToId_fk" FOREIGN KEY ("replyToId") REFERENCES "message" ("id") ON DELETE SET NULL;
