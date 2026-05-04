import { getStatistics } from "../controllers/statisticsController";
import { withAdmin } from "../middleware/auth.middleware";
import { withRateLimit } from "../middleware/rateLimit.middleware";
import { corsHeaders } from "../utils/headers";
export const statisticsRoutes = {
	"/api/statistics": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),

		GET: withRateLimit(withAdmin(getStatistics)),
	},
};
