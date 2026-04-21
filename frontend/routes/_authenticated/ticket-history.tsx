import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import TicketHistory from "../../src/pages/TicketHistory";
import { useTicketStore } from "../../src/store/ticketStore";
import { apiClient } from "../../src/utils/clientApi";
import type { Ticket } from "../../src/utils/types";

const API_URL = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/_authenticated/ticket-history")({
	loader: async (): Promise<Ticket[]> => {
		const response = await apiClient.get<Ticket[]>(API_URL);
		return response.data;
	},
	component: TicketHistoryPage,
});

function TicketHistoryPage() {
	const loaderTickets = Route.useLoaderData();
	const setTickets = useTicketStore((state) => state.setTickets);

	useEffect(() => {
		setTickets(loaderTickets);
	}, [loaderTickets, setTickets]);

	return <TicketHistory />;
}
