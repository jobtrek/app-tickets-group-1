import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { ticketQueries } from "../repositories/ticketQuery";
import { TicketPostSchema } from "../validators/ticketValidator.ts";

export const getAllTickets = async () => {
	try {
		const tickets = await ticketQueries.getAll();
		return Response.json(tickets, { status: 200, headers: corsHeaders });
	} catch (_e) {
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const getTicketById = async (req: Request): Promise<Response> => {
	try {
		const id = new URL(req.url).pathname.split("/").at(-1);

		if (!id || isNaN(Number(id))) {
			return new Response("Invalid or missing ID", {
				status: 400,
				headers: corsHeaders,
			});
		}

		const ticket = await ticketQueries.getById(Number(id));

		if (!ticket.length) {
			return new Response("Ticket not found", {
				status: 404,
				headers: corsHeaders,
			});
		}

		return Response.json(ticket[0], { status: 200, headers: corsHeaders });
	} catch (_e) {
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const createTicket = async (req: Request): Promise<Response> => {
	try {
		const body = await req.json();
		console.log(body);

		const validBody = v.safeParse(TicketPostSchema, body);

		if (!validBody.success) {
			return Response.json(
				{ errors: validBody.issues.map((i) => i.message) },
				{ status: 400, headers: corsHeaders },
			);
		}

		const { title, description, image, level, idUser } = validBody.output;

		const defaultStatus = 1;

		const result = await ticketQueries.insert(
			title,
			description,
			null,
			level ?? null,
			defaultStatus,
			idUser,
		);
		return Response.json(
			{ createdTicket: result[0] },
			{
				status: 201,
				headers: corsHeaders,
			},
		);
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers: corsHeaders });
	}
};
