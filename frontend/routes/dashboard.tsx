import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import Dashboard from "../src/pages/Dashboard";
import type { Ticket } from "../src/utils/types";

const API_URL = import.meta.env.VITE_API_URL;

export const Route = createFileRoute("/dashboard")({
	loader: async (): Promise<Ticket[]> => {
		const response = await axios.get<Ticket[]>(API_URL);
		return response.data;
	},
	component: DashboardPage,
});

function DashboardPage() {
	const tickets = Route.useLoaderData();
	const ticket = tickets[tickets.length - 1];

	if (!ticket) return <div>Aucun ticket trouvé.</div>;

	return <Dashboard data={tickets} />;
}
