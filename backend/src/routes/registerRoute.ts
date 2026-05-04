import { corsHeaders } from "backend/src/utils/headers";
import { postUser } from "../controllers/registerController";
import { withRateLimit } from "../middleware/rateLimit.middleware";

export const registerRoutes = {
	"/api/User": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		POST: withRateLimit(
			postUser,
			process.env.NODE_ENV === "production" ? 10 : 500,
		),
	},
};
