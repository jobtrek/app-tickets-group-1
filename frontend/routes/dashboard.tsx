import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import API_URL from "../../src/config/api";
import TicketView from "../src/pages/TicketView";

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
			urgency={ticket.urgency}
		/>
	);
}
