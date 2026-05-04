import { loginCorsHeaders } from "backend/src/utils/headers";
import { logoutUser } from "../controllers/logoutController";
import { withAuth } from "../middleware/auth.middleware";
import { withRateLimit } from "../middleware/rateLimit.middleware";

export const logoutRoutes = {
	"/api/logout": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: loginCorsHeaders, status: 204 }),
		POST: withRateLimit(withAuth(logoutUser)),
	},
};
