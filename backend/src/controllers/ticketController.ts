import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { ticketAssignmentQuery } from "../repositories/assigntTickerQuery.ts";
import { CookieQuery } from "../repositories/cookieQuery.ts";
import { updateStatusQuery } from "../repositories/statusQuery.ts";
import { ticketQueries } from "../repositories/ticketQuery";
import { TicketPostSchema } from "../validators/ticketValidator.ts";
export const getAllTickets = async () => {
	try {
		const tickets = await ticketQueries.getAll();
		return Response.json(tickets, { status: 200, headers: corsHeaders });
	} catch (e) {
		console.error("getAllTickets error:", e);
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const getTicketById = async (
	req: Bun.BunRequest<"/api/ticket/:id">,
): Promise<Response> => {
	try {
		const id = req.params.id;

		if (Number.isNaN(Number(id))) {
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
			image ?? null,
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

export const assignTicket = async (
	req: Bun.BunRequest<"/api/tickets/:id/assign">,
) => {
	const cookieHeader = req.headers.get("cookie");
	const sessionToken = cookieHeader?.match(/session=([^;]*)/)?.[1];

	if (!sessionToken) {
		return Response.json(
			{ error: "Not authenticated" },
			{ status: 401, headers: corsHeaders },
		);
	}

	const session = await CookieQuery.getByToken(sessionToken);

	if (!session) {
		return Response.json(
			{ error: "Invalid session" },
			{ status: 401, headers: corsHeaders },
		);
	}

	if (session.role !== "admin") {
		return Response.json(
			{ error: "Forbidden" },
			{ status: 403, headers: corsHeaders },
		);
	}

	const idTicket = Number(req.params.id);
	const idSupport: number | null = session.idUser;
	if (!idSupport) {
		return Response.json(
			{ error: "Could not resolve support user" },
			{ status: 400, headers: corsHeaders },
		);
	}

	await ticketAssignmentQuery.create(idTicket, idSupport);
	await ticketAssignmentQuery.setTicketSupport(idTicket, idSupport);

	return Response.json(
		{ message: "Ticket assigned" },
		{ status: 200, headers: corsHeaders },
	);
};

export const updateStatus = async (
	req: Bun.BunRequest<"/api/tickets/:id/status">,
) => {
	const idTicket = Number(req.params.id);
	const { statusId } = await req.json();

	await updateStatusQuery.update(statusId, idTicket);

	return Response.json(
		{ message: "Status updated" },
		{ status: 200, headers: corsHeaders },
	);
};
