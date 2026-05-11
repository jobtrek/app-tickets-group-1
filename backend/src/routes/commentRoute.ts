import { corsHeaders } from "backend/src/utils/headers";
import { getAllComment, postComment } from "../controllers/commentController";
import { withAuth } from "../middleware/auth.middleware";
import { withRateLimit } from "../middleware/rateLimit.middleware";

export const CommentRoutes = {
	"/api/tickets/:id/comment": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: withRateLimit(withAuth(getAllComment)),
		POST: withRateLimit(withAuth(postComment), 30),
	},
};
