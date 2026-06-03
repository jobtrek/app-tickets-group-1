import {
	and,
	asc,
	count,
	desc,
	eq,
	getTableColumns,
	inArray,
} from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { status, ticket_assignment, tickets, users } from "../data/schema";
import { db } from "../db/database";
import type { TicketFilters } from "../utils/constants/types";

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
	getAll: (limit: number, offset: number, filters: TicketFilters = {}) => {
		const conditions = [];

		if (filters.status?.length) {
			conditions.push(inArray(status.statusName, filters.status));
		}
		if (filters.level?.length) {
			conditions.push(inArray(tickets.level, filters.level));
		}

		const order =
			filters.sort === "asc"
				? asc(tickets.createdAt)
				: filters.sort === "az"
					? asc(tickets.title)
					: desc(tickets.createdAt);

		return baseTicketQuery()
			.where(conditions.length ? and(...conditions) : undefined)
			.limit(limit)
			.offset(offset)
			.orderBy(order);
	},

	countAll: (filters: TicketFilters = {}) => {
		const conditions = [];

		if (filters.status?.length) {
			conditions.push(inArray(status.statusName, filters.status));
		}
		if (filters.level?.length) {
			conditions.push(inArray(tickets.level, filters.level));
		}

		return db
			.select({ total: count() })
			.from(tickets)
			.innerJoin(status, eq(tickets.idStatus, status.idStatus))
			.where(conditions.length ? and(...conditions) : undefined);
	},

	getById: (idTicket: number) =>
		baseTicketQuery().where(eq(tickets.idTicket, idTicket)),

	getAllByUser: (
		idUser: number,
		limit: number,
		offset: number,
		filters: TicketFilters = {},
	) => {
		const conditions = [eq(tickets.idUser, idUser)];

		if (filters.status?.length) {
			conditions.push(inArray(status.statusName, filters.status));
		}
		if (filters.level?.length) {
			conditions.push(inArray(tickets.level, filters.level));
		}

		const order =
			filters.sort === "asc"
				? asc(tickets.createdAt)
				: filters.sort === "az"
					? asc(tickets.title)
					: desc(tickets.createdAt);

		return baseTicketQuery()
			.where(and(...conditions))
			.limit(limit)
			.offset(offset)
			.orderBy(order);
	},

	countAllByUser: (idUser: number, filters: TicketFilters = {}) => {
		const conditions = [eq(tickets.idUser, idUser)];

		if (filters.status?.length) {
			conditions.push(inArray(status.statusName, filters.status));
		}
		if (filters.level?.length) {
			conditions.push(inArray(tickets.level, filters.level));
		}

		return db
			.select({ total: count() })
			.from(tickets)
			.innerJoin(status, eq(tickets.idStatus, status.idStatus))
			.where(and(...conditions));
	},

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
			await tx
				.update(tickets)
				.set({ idStatus: 2, idSupport })
				.where(eq(tickets.idTicket, idTicket));
		}),

	updateUrgency: (idTicket: number, adminLevel: string | null) =>
		db
			.update(tickets)
			.set({ adminLevel })
			.where(eq(tickets.idTicket, idTicket))
			.returning({
				idTicket: tickets.idTicket,
				adminLevel: tickets.adminLevel,
			}),
};
