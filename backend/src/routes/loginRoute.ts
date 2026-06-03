import { loginUser } from "../controllers/loginController";
import { withRateLimit } from "../middleware/rateLimit.middleware";
import { loginCorsHeaders } from "../utils/headers";

export const LoginRoutes = {
	"/api/login": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: loginCorsHeaders, status: 204 }),
		POST: withRateLimit(
			loginUser,
			process.env.NODE_ENV === "production" ? 10 : 500,
		),
	},
};
