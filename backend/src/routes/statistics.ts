import { getStatistics } from "../controllers/statisticsController";
import { corsHeaders } from "../utils/headers";
import { withRateLimit } from "../middleware/rateLimit.middleware";
import { withAdmin } from "../middleware/auth.middleware";
export const statisticsRoutes = {
	"/api/statistics": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),

		GET: withRateLimit(withAdmin(getStatistics)),
	},
};
