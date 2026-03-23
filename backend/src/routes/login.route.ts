import { corsHeaders } from "backend/utils/headers";
import { loginUser } from "../controllers/login.controller";

export const LoginRoutes = {
	"/api/login": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		POST: loginUser,
	},
};
