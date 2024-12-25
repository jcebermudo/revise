ALTER TABLE "user" ADD COLUMN "email_verified" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "registered_2fa" boolean NOT NULL;