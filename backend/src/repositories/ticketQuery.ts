import { eq, getTableColumns } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { status, ticket_assignment, tickets, users } from "../data/schema";
import { db } from "../db/database";

const supportUsers = alias(users, "support_users");

const baseTicketQuery = () =>
	db
		.select({
			...getTableColumns(tickets),
			username: users.username,
			statusName: status.statusName,
			supportUsername: supportUsers.username,
		})
		.from(tickets)
		.innerJoin(users, eq(tickets.idUser, users.idUser))
		.innerJoin(status, eq(tickets.idStatus, status.idStatus))
		.leftJoin(supportUsers, eq(tickets.idSupport, supportUsers.idUser));

export const ticketQueries = {
	getAll: () => baseTicketQuery(),

	getById: (idTicket: number) =>
		baseTicketQuery().where(eq(tickets.idTicket, idTicket)),

	getAllByUser: (idUser: number) =>
		baseTicketQuery().where(eq(tickets.idUser, idUser)),
	getAllSupport: () =>
		db
			.select({ idUser: users.idUser, username: users.username })
			.from(users)
			.where(eq(users.role, "admin")),
	insert: async (
		title: string,
		description: string,
		image: string | null,
		level: string | null,
		idStatus: number,
		idUser: number,
	) => {
		return await db
			.insert(tickets)
			.values({ title, description, image, level, idStatus, idUser })
			.returning();
	},

	confirmed: async (idTicket: number, value: boolean) => {
		const [row] = await db
			.update(tickets)
			.set({ hasAdminConfirmed: value }) // explicit, not a toggle
			.where(eq(tickets.idTicket, idTicket))
			.returning({ hasAdminConfirmed: tickets.hasAdminConfirmed });

		if (!row) throw new Error("Ticket not found");
		return row.hasAdminConfirmed;
	},
	assign: (idTicket: number, idSupport: number) =>
		db.transaction(async (tx) => {
			await tx
				.update(ticket_assignment)
				.set({ isActive: false })
				.where(eq(ticket_assignment.idTicket, idTicket));
			await tx
				.insert(ticket_assignment)
				.values({ idTicket, idSupport, isActive: true });
		}),
};
