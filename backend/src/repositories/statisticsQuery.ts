import { eq, sql } from "drizzle-orm";
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
				moyenneHeures: sql<number>`
                    AVG(EXTRACT(EPOCH FROM (${firstAssign.assignedAt} - ${tickets.createdAt})) / 3600)
                `.mapWith(Number),
			})
			.from(tickets)
			.innerJoin(firstAssign, eq(firstAssign.idTicket, tickets.idTicket));
	},
};
