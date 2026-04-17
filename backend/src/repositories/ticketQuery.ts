import { eq, getTableColumns } from "drizzle-orm";
import { status, tickets, users } from "../data/schema";
import { db } from "../db/database";

export const ticketQueries = {
	getAll: () =>
		db
			.select({
				...getTableColumns(tickets),
				username: users.username,
				statusName: status.statusName,
			})
			.from(tickets)
			.innerJoin(users, eq(tickets.idUser, users.idUser))
			.innerJoin(status, eq(tickets.idStatus, status.idStatus)),

	getById: (idTicket: number) =>
		db
			.select({
				...getTableColumns(tickets),
				username: users.username,
				statusName: status.statusName,
			})
			.from(tickets)
			.innerJoin(users, eq(tickets.idUser, users.idUser))
			.innerJoin(status, eq(tickets.idStatus, status.idStatus))
			.where(eq(tickets.idTicket, idTicket)),

	insert: (
		title: string,
		description: string,
		image: string | null,
		level: string | null,
		idStatus: number,
		idUser: number,
	) =>
		db
			.insert(tickets)
			.values({ title, description, image, level, idStatus, idUser })
			.returning(),
};
