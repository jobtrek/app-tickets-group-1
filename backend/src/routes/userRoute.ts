import { updateUserById } from "../controllers/userController";
import { withAuth } from "../middleware/auth.middleware";
import { withRateLimit } from "../middleware/rateLimit.middleware";
import { corsHeaders } from "../utils/headers";

export const UserRoutes = {
	"/api/user/:id": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		PATCH: withRateLimit(withAuth(updateUserById)),
	},
};
