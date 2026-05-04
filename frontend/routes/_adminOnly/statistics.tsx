import { createFileRoute } from "@tanstack/react-router";
import Statistics from "../../src/pages/Statistics";
import { apiClient } from "../../src/utils/clientApi";
import type { StatsProps } from "../../src/utils/types";

const STATS_URL = import.meta.env.VITE_STATS_URL;

export const Route = createFileRoute("/_adminOnly/statistics")({
	loader: async (): Promise<StatsProps> => {
		const response = await apiClient.get<StatsProps>(STATS_URL);
		return response.data;
	},
	staleTime: 0,
	component: RouteComponent,
});

function RouteComponent() {
	const data = Route.useLoaderData();
	return <Statistics stats={data} />;
}
