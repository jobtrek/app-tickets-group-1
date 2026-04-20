import { loginCorsHeaders, logoutUser } from "../controllers/logoutController";

export const logoutRoutes = {
	"/api/logout": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: loginCorsHeaders, status: 204 }),
		POST: logoutUser,
	},
};
