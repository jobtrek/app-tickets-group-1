import { TicketStatus } from "backend/utils/constants";
import { headers } from "../../utils/headers";
import { db } from "../db/database";
import { queries } from "../repositories/ticketQuery";
export const getResponse = () => {
	try {
		const tickets = db.query(queries.tickets.getAll).all();
		return Response.json(tickets, { status: 200, headers });
	} catch (_e) {
		return new Response("DB Error", { status: 500, headers });
	}
};

export const insertResponse = async (req: Request): Promise<Response> => {
	try {
		const body = await req.json();

		const { title, description, level, id_user } = body;
		const defaultStatus = TicketStatus.Opened;
		const insert = db.prepare(queries.tickets.insert);

		const result = insert.get(
			title,
			description,
			level,
			defaultStatus,
			id_user,
		);

		return Response.json(result, {
			status: 201,
			headers,
		});
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers });
	}
};
