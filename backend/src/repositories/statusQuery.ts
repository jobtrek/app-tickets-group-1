import { eq } from "drizzle-orm";
import { tickets } from "../data/schema";
import { db } from "../db/database";

export const updateStatusQuery = {
	update: (statusId: number, idTicket: number) =>
		db
			.update(tickets)
			.set({
				idStatus: statusId,
				...(statusId === 4 ? { updatedAt: new Date() } : {}),
			})
			.where(eq(tickets.idTicket, idTicket)),
};
