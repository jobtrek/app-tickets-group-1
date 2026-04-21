import { eq, getTableColumns } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { status, tickets, users } from "../data/schema";
import { db } from "../db/database";

const supportUsers = alias(users, "support_users");

export const ticketQueries = {
	getAll: () =>
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
			.leftJoin(supportUsers, eq(tickets.idSupport, supportUsers.idUser)),

	getById: (idTicket: number) =>
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
			.leftJoin(supportUsers, eq(tickets.idSupport, supportUsers.idUser))
			.where(eq(tickets.idTicket, idTicket)),

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

	confirmed: async (idTicket: number) => {
		const ticket = await db
			.select({ hasAdminConfirmed: tickets.hasAdminConfirmed })
			.from(tickets)
			.where(eq(tickets.idTicket, idTicket))
			.limit(1);

		const [row] = ticket;
		if (!row) throw new Error("Ticket not found");

		const newValue = !(row.hasAdminConfirmed ?? false);

		await db
			.update(tickets)
			.set({ hasAdminConfirmed: newValue })
			.where(eq(tickets.idTicket, idTicket));

		return newValue;
	},
};
