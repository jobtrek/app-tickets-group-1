import { corsHeaders } from "backend/utils/headers";
import {
	assignTicket,
	createTicket,
	getAllAdmins,
	getAllTickets,
	getTicketById,
	ownerConfirmTicket,
	UpdateConfirmation,
	updateStatus,
} from "../controllers/ticketController";
import { withAuth } from "../middleware/auth.middleware";
import { withRateLimit } from "../middleware/rateLimit.middleware";

export const ticketRoutes = {
	"/api/tickets": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: withRateLimit(withAuth(getAllTickets)),
		POST: withRateLimit(withAuth(createTicket)),
	},
	"/api/ticket/:id": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: withRateLimit(withAuth(getTicketById)),
	},
	"/api/tickets/:id/assign": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		POST: withRateLimit(withAuth(assignTicket)),
	},
	"/api/tickets/:id/status": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		PATCH: withRateLimit(withAuth(updateStatus)),
	},
	"/api/tickets/:id/confirm": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		PATCH: withAuth(UpdateConfirmation),
	},
	"/api/tickets/:id/owner-confirm": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		PATCH: withRateLimit(withAuth(ownerConfirmTicket)),
	},
	"/api/tickets/admin": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: withRateLimit(withAuth(getAllAdmins)),
	},
};
