import { corsHeaders } from "../../utils/headers";
import { statisticsQuery } from "../repositories/statisticsQuery";

export const getStatistics = async () => {
	try {
		// Run all queries in parallel for maximum speed
		const [avgFirstAssign, avgCloseTicket] = await Promise.all([
			statisticsQuery.avgTimeToFirstAssignment(),
			statisticsQuery.avgTimeToCloseTicket(),
		]);

		// Construct a single clean object
		const data = {
			avgTimeToFirstAssignment: avgFirstAssign[0]?.moyenne ?? 0,
			avgTimeToCloseTicket: avgCloseTicket[0]?.moyenne ?? 0,
			// Add more here as you grow...
		};

		return Response.json(data, {
			status: 200,
			headers: corsHeaders,
		});
	} catch (e) {
		console.error("Statistics Fetch Error:", e);
		return new Response("Error fetching dashboard stats", {
			status: 500,
			headers: corsHeaders,
		});
	}
};
