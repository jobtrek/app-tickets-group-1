import { corsHeaders } from "backend/utils/headers";
import { statisticsQuery } from "../repositories/statisticsQuery";

export const avgTimeToFirstAssignment = async () => {
	try {
		const timeToTake = await statisticsQuery.avgTimeToFirstAssignment();
		return Response.json(timeToTake, { status: 200, headers: corsHeaders });
	} catch (e) {
		console.error("DB fetch error", e);
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};
