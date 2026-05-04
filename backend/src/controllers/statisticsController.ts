import { corsHeaders } from "../../utils/headers";
import { statisticsQuery } from "../repositories/statisticsQuery";

export const getStatistics = async () => {
	try {
		const [avgFirstAssign, avgCloseTicket, ticketsCountPerStatus, ticketsPerMonth] = await Promise.all([
			statisticsQuery.avgTimeToFirstAssignment(),
			statisticsQuery.avgTimeToCloseTicket(),
			statisticsQuery.ticketsCountPerStatus(),
			statisticsQuery.ticketsPerMonth(),
		]);

		const data = {
			avgTimeToFirstAssignment: avgFirstAssign[0]?.moyenne ?? 0,
			avgTimeToCloseTicket: avgCloseTicket[0]?.moyenne ?? 0,
			ticketsCountPerStatus: ticketsCountPerStatus ?? [],
			ticketsPerMonth: ticketsPerMonth ?? [],
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
