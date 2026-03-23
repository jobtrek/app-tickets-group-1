import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { TICKET_URL } from "../../src/config/api";
import TicketView from "../src/pages/TicketView";

export const Route = createFileRoute("/ticket/$id")({
	loader: async ({ params }) => {
		const response = await axios.get(`${TICKET_URL}/${params.id}`);
		return response.data;
	},

	component: TicketViewPage,
});

function TicketViewPage() {
	const ticket = Route.useLoaderData();

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
