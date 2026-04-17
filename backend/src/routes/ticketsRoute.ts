import { corsHeaders } from "backend/utils/headers";
import {
	assignTicket,
	createTicket,
	getAllTickets,
	getTicketById,
	updateStatus,
} from "../controllers/ticketController";

export const ticketRoutes = {
	"/api/tickets": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: getAllTickets,
		POST: createTicket,
	},
	"/api/ticket/:id": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: getTicketById,
	},
	"/api/tickets/:id/assign": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		POST: assignTicket,
	},
	"/api/tickets/:id/status": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		PATCH: updateStatus,
	},
};
