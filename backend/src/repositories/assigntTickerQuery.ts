import { eq } from "drizzle-orm";
import { ticket_assignment, tickets } from "../data/schema";
import { db } from "../db/database";

export const ticketAssignmentQuery = {
	create: (idTicket: number, idSupport: number) =>
		db
			.insert(ticket_assignment)
			.values({ idTicket, idSupport, isActive: true }),
	setTicketSupport: (idTicket: number, idSupport: number) =>
		db.update(tickets).set({ idSupport }).where(eq(tickets.idTicket, idTicket)),
};
