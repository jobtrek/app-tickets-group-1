ALTER TABLE "cookies" ALTER COLUMN "id_cookie" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "cookies" ALTER COLUMN "id_cookie" ADD GENERATED ALWAYS AS IDENTITY (sequence name "cookies_id_cookie_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "status" ALTER COLUMN "id_status" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "status" ALTER COLUMN "id_status" ADD GENERATED ALWAYS AS IDENTITY (sequence name "status_id_status_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "ticket_assignment" ALTER COLUMN "id_assignment" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "ticket_assignment" ALTER COLUMN "id_assignment" ADD GENERATED ALWAYS AS IDENTITY (sequence name "ticket_assignment_id_assignment_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "ticket" ALTER COLUMN "id_ticket" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "ticket" ALTER COLUMN "id_ticket" ADD GENERATED ALWAYS AS IDENTITY (sequence name "ticket_id_ticket_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id_user" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id_user" ADD GENERATED ALWAYS AS IDENTITY (sequence name "users_id_user_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1);