CREATE TABLE "password_reset_request" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"email" text NOT NULL,
	"code" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"two_factor_verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "email_verification_request" ADD PRIMARY KEY ("id");--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "username" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "email_verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "two_factor_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "totp_key" text;--> statement-breakpoint
ALTER TABLE "password_reset_request" ADD CONSTRAINT "password_reset_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "email_index" ON "user" USING btree ("email");--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "registered_2fa";--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_email_unique" UNIQUE("email");