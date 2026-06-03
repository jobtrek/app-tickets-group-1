import { createFileRoute } from "@tanstack/react-router";
import TicketHistory from "../../src/pages/TicketHistory";
import { fetchTickets } from "../../src/utils/ticketsApi";

export const Route = createFileRoute("/_authenticated/ticket-history")({
	validateSearch: (search) => ({
		page: Number(search.page ?? 1),
		size: Number(search.size ?? 20),
		sort: (search.sort as string) ?? "desc",
		status: Array.isArray(search.status)
			? (search.status as string[])
			: search.status
				? [search.status as string]
				: [],
		level: Array.isArray(search.level)
			? (search.level as string[])
			: search.level
				? [search.level as string]
				: [],
	}),
	loaderDeps: ({ search }) => ({
		page: search.page,
		size: search.size,
		sort: search.sort,
		status: search.status,
		level: search.level,
	}),
	loader: async ({ deps }) =>
		fetchTickets(deps.page, deps.size, deps.sort, deps.status, deps.level),
	shouldReload: true,
	staleTime: 0,
	component: TicketHistoryPage,
});

function TicketHistoryPage() {
	const { data, totalPages, page } = Route.useLoaderData();
	const { sort, status, level } = Route.useSearch();

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
