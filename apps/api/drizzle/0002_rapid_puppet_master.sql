CREATE TABLE "line_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"invoice_id" integer NOT NULL,
	"item_name" text,
	"description" text,
	"quantity" numeric,
	"rate" numeric,
	"amount" numeric
);
--> statement-breakpoint
CREATE TABLE "registration_counter" (
	"id" serial PRIMARY KEY NOT NULL,
	"current_count" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"registration_order" integer NOT NULL,
	"tier" varchar(20) NOT NULL,
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"trial_start" timestamp,
	"trial_end" timestamp,
	"stripe_customer_id" varchar(255),
	"stripe_subscription_id" varchar(255),
	"stripe_price_id" varchar(255),
	"current_period_start" timestamp,
	"current_period_end" timestamp,
	"cancel_at_period_end" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_registration_order_unique" UNIQUE("registration_order"),
	CONSTRAINT "idx_subscriptions_registration_order" UNIQUE("registration_order")
);
--> statement-breakpoint
ALTER TABLE "attachments" ADD COLUMN "status" text DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "s3_json_key" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_subscriptions_user_id" ON "subscriptions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_subscriptions_stripe_customer" ON "subscriptions" USING btree ("stripe_customer_id");--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "line_items";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "cost_code";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "quantity";--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "rate";