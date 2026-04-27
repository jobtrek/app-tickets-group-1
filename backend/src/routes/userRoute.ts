import { loginCorsHeaders } from "../controllers/loginController";
import { updateUserById } from "../controllers/userController";

export const LoginRoutes = {
	"/api/user/:id": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: loginCorsHeaders, status: 204 }),
		PATCH: updateUserById,
	},
};
