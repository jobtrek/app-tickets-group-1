import { TicketStatus } from "backend/utils/constants";
import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { db } from "../db/database.ts";
import { ticketQueries } from "../repositories/ticketQuery";
import { TicketPostSchema } from "../validators/ticket.validator.ts";

export const getAllTickets = () => {
	try {
		const tickets = db.query(ticketQueries.getAll).all();
		return Response.json(tickets, { status: 200, headers: corsHeaders });
	} catch (_e) {
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const createTicket = async (req: Request): Promise<Response> => {
	try {
		const body = await req.json();

		const validBody = v.safeParse(TicketPostSchema, body);

		if (!validBody.success) {
			return Response.json(
				{ errors: validBody.issues.map((i) => i.message) },
				{ status: 400, headers: corsHeaders },
			);
		}

		const { title, description, level, id_user } = validBody.output;

		const defaultStatus = TicketStatus.Ouvert;
		const insert = db.prepare(ticketQueries.insert);

		const result = insert.get(
			title,
			description,
			level ?? null,
			defaultStatus,
			id_user,
		);
		return Response.json(result, {
			status: 201,
			headers: corsHeaders,
		});
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers: corsHeaders });
	}
};
