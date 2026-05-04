import { getStatistics } from "../controllers/statisticsController";
import { corsHeaders } from "../utils/headers";

export const statisticsRoutes = {
	"/api/statistics": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),

		GET: getStatistics,
	},
};
