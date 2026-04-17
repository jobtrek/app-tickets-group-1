import { corsHeaders } from "backend/utils/headers";
import {
	createTicket,
	getAllTickets,
	getTicketById,
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
};
