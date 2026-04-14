import { loginCorsHeaders, loginUser } from "../controllers/login.controller";

export const LoginRoutes = {
	"/api/login": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: loginCorsHeaders, status: 204 }),
		POST: loginUser,
	},
};
