import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import Dashboard from "../../src/pages/Dashboard";
import { useTicketStore } from "../../src/store/ticketStore";
import { apiClient } from "../../src/utils/clientApi";
import { useTicketListUpdates } from "../../src/utils/useTicketListUpdates";
import type { Ticket } from "../../src/utils/types";

const API_URL = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/_adminOnly/dashboard")({
	loader: async (): Promise<Ticket[]> => {
		const response = await apiClient.get<Ticket[]>(API_URL);
		return response.data;
	},
	component: DashboardPage,
});

function DashboardPage() {
	const loaderTickets = Route.useLoaderData();
	const setTickets = useTicketStore((state) => state.setTickets);
	useTicketListUpdates();

	useEffect(() => {
		setTickets(loaderTickets);
	}, [loaderTickets, setTickets]);

	return <Dashboard />;
}
