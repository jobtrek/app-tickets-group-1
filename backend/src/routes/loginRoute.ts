import { loginCorsHeaders, loginUser } from "../controllers/loginController";

export const LoginRoutes = {
	"/api/login": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: loginCorsHeaders, status: 204 }),
		POST: loginUser,
	},
};
