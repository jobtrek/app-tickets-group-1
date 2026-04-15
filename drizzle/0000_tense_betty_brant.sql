CREATE TABLE "cookies" (
	"id_cookie" serial PRIMARY KEY NOT NULL,
	"session_token" varchar NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"id_user" integer
);
--> statement-breakpoint
CREATE TABLE "status" (
	"id_status" serial PRIMARY KEY NOT NULL,
	"status_name" varchar(50) NOT NULL,
	"changed_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ticket_assignment" (
	"id_assignment" serial PRIMARY KEY NOT NULL,
	"id_ticket" integer,
	"id_support" integer,
	"assigned_at" timestamp DEFAULT now(),
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "ticket" (
	"id_ticket" serial PRIMARY KEY NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar NOT NULL,
	"image" varchar,
	"level" varchar(30),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"id_status" varchar(30),
	"id_user" integer,
	"id_support" integer
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id_user" serial PRIMARY KEY NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(100) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" varchar(20) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "cookies" ADD CONSTRAINT "cookies_id_user_users_id_user_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_assignment" ADD CONSTRAINT "ticket_assignment_id_ticket_ticket_id_ticket_fk" FOREIGN KEY ("id_ticket") REFERENCES "public"."ticket"("id_ticket") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket_assignment" ADD CONSTRAINT "ticket_assignment_id_support_users_id_user_fk" FOREIGN KEY ("id_support") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_id_user_users_id_user_fk" FOREIGN KEY ("id_user") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ticket" ADD CONSTRAINT "ticket_id_support_users_id_user_fk" FOREIGN KEY ("id_support") REFERENCES "public"."users"("id_user") ON DELETE no action ON UPDATE no action;