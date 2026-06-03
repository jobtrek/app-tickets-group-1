import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../../src/pages/Dashboard";
import { dashboardSearchSchema } from "../../src/utils/ticketSearch";
import { fetchTickets } from "../../src/utils/ticketsApi";

// import { useTicketListUpdates } from "../../src/utils/useTicketListUpdates";

export const Route = createFileRoute("/_adminOnly/dashboard")({
	validateSearch: dashboardSearchSchema,
	loaderDeps: ({ search }) => ({
		page: search.page,
		size: search.size,
		sort: search.sort,
		status: search.status,
		search: search.search,
		level: search.level,
	}),
	loader: async ({ deps }) =>
		fetchTickets(deps.page, deps.size, deps.sort, deps.status, deps.search,deps.level),
	component: DashboardPage,
});

function DashboardPage() {
	const { data, totalPages, page } = Route.useLoaderData();
	const { sort, status, level, search } = Route.useSearch();

	return (
		<Dashboard
			tickets={data}
			totalPages={totalPages}
			page={page}
			sort={sort}
			status={status}
			level={level}
			search={search}
		/>
	);
}
