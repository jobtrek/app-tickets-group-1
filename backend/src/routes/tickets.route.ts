import { headers } from "backend/utils/headers";
import { getResponse, insertResponse } from "../controllers/ticket.controller";

export const ticketRoutes = {
	"/api/tickets": {
		OPTIONS: (_req: Request) => new Response(null, { headers, status: 204 }),
		GET: getResponse,
		POST: insertResponse,
	},
};
