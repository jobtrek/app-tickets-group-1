import { corsHeaders } from "backend/utils/headers";
import { createTicket, getAllTickets } from "../controllers/ticket.controller";

export const ticketRoutes = {
	"/api/tickets": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: getAllTickets,
		POST: createTicket,
	},
};
