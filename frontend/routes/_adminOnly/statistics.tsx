import { createFileRoute } from "@tanstack/react-router";
import Statistics from "../../src/pages/Statistics";
import { apiClient } from "../../src/utils/clientApi";

const STATS_URL = import.meta.env.VITE_STATS_URL;

export const Route = createFileRoute("/_adminOnly/statistics")({
	loader: async (): Promise<number> => {
		const response = await apiClient.get<number>(STATS_URL);
		return response.data;
	},
	staleTime: 0,
	component: RouteComponent,
});

function RouteComponent() {
	const timeToTake = Route.useLoaderData();
	return <Statistics timeToTake={timeToTake} />;
}
