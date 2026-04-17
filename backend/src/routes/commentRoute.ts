import { getAllComment, postComment, websocketUpgrade } from "../controllers/commentController";
import { loginCorsHeaders } from "../controllers/loginController";

export const CommentRoutes = {
	"/api/tickets/:id/comment": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: loginCorsHeaders, status: 204 }),
		POST: postComment,
		GET: getAllComment,
	},
	"/api/tickets/:id/ws": {
		GET: websocketUpgrade,
	},
};
