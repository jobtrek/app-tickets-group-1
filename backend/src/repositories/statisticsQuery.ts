import { desc, eq, sql } from "drizzle-orm";
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
		const lastAssign = db
			.selectDistinctOn([ticket_assignment.idTicket], {
				idTicket: ticket_assignment.idTicket,
				assignedAt: ticket_assignment.assignedAt,
			})
			.from(ticket_assignment)
			.orderBy(ticket_assignment.idTicket, desc(ticket_assignment.assignedAt))
			.as("last_assign");

		return db
			.select({
				moyenne: sql<number>`
            ROUND(
                AVG(
                    EXTRACT(EPOCH FROM (${lastAssign.assignedAt} - ${tickets.createdAt}))
                ),
                0
            )
            `.mapWith(Number),
			})
			.from(tickets)
			.innerJoin(lastAssign, eq(lastAssign.idTicket, tickets.idTicket));
	},
};
