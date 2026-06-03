import { updateUserById } from "../controllers/userController";
import type { AuthedRequest } from "../middleware/auth.middleware";
import { withAuth } from "../middleware/auth.middleware";
import { withRateLimit } from "../middleware/rateLimit.middleware";
import { corsHeaders } from "../utils/headers";
import { jsonResponse } from "../utils/responseFactory";

export const UserRoutes = {
	"/api/me": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: withAuth((req: AuthedRequest) => jsonResponse(req.user)),
	},
	"/api/user/:id": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		PATCH: withRateLimit(withAuth(updateUserById)),
	},
};
