import { statisticsQuery } from "../repositories/statisticsQuery";
import { errorResponse, jsonResponse } from "../utils/responseFactory";
export const getStatistics = async () => {
	try {
		const [
			avgFirstAssign,
			avgCloseTicket,
			ticketsCountPerStatus,
			ticketsPerMonth,
		] = await Promise.all([
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

		return jsonResponse(data, 200);
	} catch (e) {
		console.error("Statistics Fetch Error:", e);
		return errorResponse("Error fetching dashboard stats", 500);
	}
};
