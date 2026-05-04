import { count, eq, sql } from "drizzle-orm";
import { ticket_assignment, tickets } from "../data/schema";
import { db } from "../db/database";

export const statisticsQuery = {
	avgTimeToFirstAssignment: () => {
		const firstAssign = db
			.selectDistinctOn([ticket_assignment.idTicket], {
				idTicket: ticket_assignment.idTicket,
				assignedAt: ticket_assignment.assignedAt,
			})
			.from(ticket_assignment)
			.orderBy(ticket_assignment.idTicket, ticket_assignment.assignedAt)
			.as("first_assign");

		return db
			.select({
				moyenne: sql<number>`
				ROUND(
                    AVG(EXTRACT(EPOCH FROM (${firstAssign.assignedAt} - ${tickets.createdAt}))),
					0
				)
                `.mapWith(Number),
			})
			.from(tickets)
			.innerJoin(firstAssign, eq(firstAssign.idTicket, tickets.idTicket));
	},

	avgTimeToCloseTicket: () => {
		return db
			.select({
				moyenne: sql<number>`
                ROUND(
                    AVG(
                        EXTRACT(EPOCH FROM (${tickets.updatedAt} - ${tickets.createdAt}))
                    ),
                    0
                )
                `.mapWith(Number),
			})
			.from(tickets)
			.where(eq(tickets.idStatus, 4));
	},

	ticketsCountPerStatus: () => {
		return db
			.select({
				status: tickets.idStatus,
				count: count(),
			})
			.from(tickets)
			.groupBy(tickets.idStatus);
	},

	ticketsPerMonth: () => {
		return db
			.select({
				month: sql<string>`date_trunc('month', ${tickets.createdAt})`.as('month'),
				count: count(),
			})
			.from(tickets)
			.groupBy(sql`month`)
	}
};
