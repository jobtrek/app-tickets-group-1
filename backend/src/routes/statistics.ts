import { corsHeaders } from "../../utils/headers";
import { avgTimeToFirstAssignment } from "../controllers/statisticsController";

export const statisticsRoutes = {
	"/api/statistics": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),

		GET: avgTimeToFirstAssignment,
	},
};
