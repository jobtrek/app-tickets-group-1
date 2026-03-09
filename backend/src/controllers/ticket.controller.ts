import { TicketStatus } from "backend/utils/constants";
import * as v from "valibot";
import { headers } from "../../utils/headers";
import { db } from "../db/database.ts";
import { queries } from "../repositories/ticketQuery";
import { TicketPostSchema } from "../validators/ticket.validator.ts";

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

		const validBody = v.safeParse(TicketPostSchema, body);

		if (!validBody.success) {
			return Response.json(
				{ errors: validBody.issues.map((i) => i.message) },
				{ status: 400, headers },
			);
		}

		const { title, description, level, id_user } = validBody.output;

		const defaultStatus = TicketStatus.Opened;
		const insert = db.prepare(queries.tickets.insert);

		insert.get(title, description, level ?? null, defaultStatus, id_user);
		return new Response("Ticket created successfully", {
			status: 201,
			headers,
		});
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers });
	}
};
