import { corsHeaders } from "backend/utils/headers";
import { postUser } from "../controllers/register.controller";

export const registerRoutes = {
	"/api/User": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),

		POST: postUser,
	},
};
