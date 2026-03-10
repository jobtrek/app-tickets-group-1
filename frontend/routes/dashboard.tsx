import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import API_URL from "../../src/config/api";
import Dashboard from "../src/pages/Dashboard";

export interface Ticket {
	id_ticket: number;
	title: string;
	description: string;
	image: string | null;
	level: "bas" | "moyen" | "haut" | "urgent";
	created_at: string;
	updated_at: string;
	id_status: "Ouvert" | "En cours" | "Fermé" | "Résolu";
	id_user: number;
}

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
	const tickets = Route.useLoaderData();
	const ticket = tickets[tickets.length - 1];

	if (!ticket) return <div>Aucun ticket trouvé.</div>;

	return <Dashboard data={tickets} />;
}
