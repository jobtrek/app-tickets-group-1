import { corsHeaders } from "backend/utils/headers";
import { updateUserById } from "../controllers/userController";
export const UserRoutes = {
	"/api/user/:id": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		PATCH: updateUserById,
	},
};
