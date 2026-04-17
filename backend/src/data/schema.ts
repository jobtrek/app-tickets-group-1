import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	idUser: integer("id_user").primaryKey().generatedAlwaysAsIdentity(),
	username: varchar("username", { length: 50 }).notNull(),
	email: varchar("email", { length: 100 }).notNull().unique(),
	password: varchar("password", { length: 255 }).notNull(),
	role: varchar("role", { length: 20 }).notNull().default("user"),
});

export const status = pgTable("status", {
	idStatus: integer("id_status").primaryKey().generatedAlwaysAsIdentity(),
	statusName: varchar("status_name", { length: 50 }).notNull(),
	changedAt: timestamp("changed_at").defaultNow(),
});

export const tickets = pgTable("ticket", {
	idTicket: integer("id_ticket").primaryKey().generatedAlwaysAsIdentity(),
	title: varchar("title", { length: 100 }).notNull(),
	description: varchar("description").notNull(),
	image: varchar("image"),
	level: varchar("level", { length: 30 }),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	idStatus: integer("id_status").references(() => status.idStatus),
	idUser: integer("id_user").references(() => users.idUser),
	idSupport: integer("id_support").references(() => users.idUser),
});

export const cookies = pgTable("cookies", {
	idCookies: integer("id_cookie").primaryKey().generatedAlwaysAsIdentity(),
	sessionToken: varchar("session_token").notNull(),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").defaultNow(),
	idUser: integer("id_user").references(() => users.idUser),
});

export const ticket_assignment = pgTable("ticket_assignment", {
	idAssignment: integer("id_assignment")
		.primaryKey()
		.generatedAlwaysAsIdentity(),
	idTicket: integer("id_ticket").references(() => tickets.idTicket),
	idSupport: integer("id_support").references(() => users.idUser),
	assignedAt: timestamp("assigned_at").defaultNow(),
	isActive: boolean("is_active").default(true),
});

export const comments = pgTable("comments", {
	idComment: integer("id_comment").primaryKey().generatedAlwaysAsIdentity(),
	userRole: varchar("user_role", { length: 30 }).notNull(),
	commentText: text("comment_text").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	idUser: integer("id_user")
		.references(() => users.idUser)
		.notNull(),
	idTicket: integer("id_ticket")
		.references(() => tickets.idTicket)
		.notNull(),
});
