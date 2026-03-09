import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import TicketView from "../src/pages/TicketView";

const API_URL = "http://localhost:3001/api/tickets";

export const Route = createFileRoute("/dashboard")({
	loader: async () => {
		const response = await axios.get(API_URL);
		return response.data;
	},
	component: DashboardPage,
});

function DashboardPage() {
	const tickets = Route.useLoaderData();
	const ticket = tickets[tickets.length - 1];

	if (!ticket) return <div>Aucun ticket trouvé.</div>;

	return (
		<TicketView
			id={ticket.id_ticket}
			title={ticket.title}
			description={ticket.description}
			date={ticket.created_at}
			level={ticket.level}
		/>
	);
}
