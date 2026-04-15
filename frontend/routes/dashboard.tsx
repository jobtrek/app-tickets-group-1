import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { useEffect } from "react";
import API_URL from "../../src/config/api";
import Dashboard from "../src/pages/Dashboard";
import { useTicketStore } from "../src/store/ticketStore";
import type { Ticket } from "../src/utils/types";

export const Route = createFileRoute("/dashboard")({
	loader: async (): Promise<Ticket[]> => {
		const response = await axios.get<Ticket[]>(API_URL);
		console.log(response);
		console.log(response.data);

		return response.data;
	},
	component: DashboardPage,
});

function DashboardPage() {
	const loaderTickets = Route.useLoaderData();
	const setTickets = useTicketStore((state) => state.setTickets);
	const tickets = useTicketStore((state) => state.tickets);

	useEffect(() => {
		setTickets(loaderTickets);
	}, []);

	return <Dashboard />;
}
