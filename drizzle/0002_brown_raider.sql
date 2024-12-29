ALTER TABLE "user" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "google_name" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "name";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");