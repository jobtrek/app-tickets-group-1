import { createFileRoute } from "@tanstack/react-router";
import TicketHistory from "../../src/pages/TicketHistory";
import { ticketHistorySearchSchema } from "../../src/utils/ticketSearch";
import { fetchTickets } from "../../src/utils/ticketsApi";

export const Route = createFileRoute("/_authenticated/ticket-history")({
	validateSearch: ticketHistorySearchSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		size: search.size,
		sort: search.sort,
		status: search.status,
	}),
	loader: async ({ deps }) =>
		fetchTickets(deps.page, deps.size, deps.sort, deps.status),
	shouldReload: true,
	staleTime: 0,
	component: TicketHistoryPage,
});

function TicketHistoryPage() {
	const { data, totalPages, page } = Route.useLoaderData();
	const { sort, status } = Route.useSearch();

	return (
		<TicketHistory
			tickets={data}
			totalPages={totalPages}
			page={page}
			sort={sort}
			status={status}
		/>
	);
}
