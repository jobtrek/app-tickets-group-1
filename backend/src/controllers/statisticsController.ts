import { corsHeaders } from "../../utils/headers";
import { statisticsQuery } from "../repositories/statisticsQuery";

export const avgTimeToFirstAssignment = async () => {
	try {
		const [result] = await statisticsQuery.avgTimeToFirstAssignment();
		return Response.json(result?.moyenneHeures ?? 0, {
			status: 200,
			headers: corsHeaders,
		});
	} catch (e) {
		console.error("DB fetch error", e);
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};
