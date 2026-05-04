import { loginCorsHeaders } from "backend/src/utils/headers";
import {
	getAllComment,
	postComment,
	websocketUpgrade,
} from "../controllers/commentController";
import { withAuth } from "../middleware/auth.middleware";
import { withRateLimit } from "../middleware/rateLimit.middleware";

export const CommentRoutes = {
	"/api/tickets/:id/comment": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: loginCorsHeaders, status: 204 }),
		GET: withRateLimit(withAuth(getAllComment)),
		POST: withRateLimit(withAuth(postComment), 30),
	},
	"/api/tickets/:id/ws": {
		GET: withAuth(websocketUpgrade),
	},
};
