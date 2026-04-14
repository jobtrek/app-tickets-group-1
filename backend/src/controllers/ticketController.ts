import * as v from "valibot";
import { TicketStatus } from "../../utils/constants";
import { corsHeaders } from "../../utils/headers";
import { db } from "../db/database.ts";
import { ticketQueries } from "../repositories/ticketQuery";
import { TicketPostSchema } from "../validators/ticketValidator.ts";

export const getAllTickets = () => {
	try {
		const tickets = db.query(ticketQueries.getAll).all();
		return Response.json(tickets, { status: 200, headers: corsHeaders });
	} catch (_e) {
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const getTicketById = (req: Request): Response => {
	try {
		const id = new URL(req.url).pathname.split("/").at(-1);
		if (!id) {
			return new Response("Missing ID", { status: 400, headers: corsHeaders });
		}
		const ticket = db.prepare(ticketQueries.getById).get(id);
		return Response.json(ticket, { status: 200, headers: corsHeaders });
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

		const { title, description, level, idUser } = validBody.output;

		const defaultStatus = TicketStatus.Ouvert;
		const insert = db.prepare(ticketQueries.insert);

		const result = insert.get(
			title,
			description,
			level ?? null,
			defaultStatus,
			idUser,
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
