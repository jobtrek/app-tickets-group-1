import { createFileRoute } from "@tanstack/react-router";
import Dashboard from "../../src/pages/Dashboard";
import { fetchTickets } from "../../src/utils/ticketsApi";

// import { useTicketListUpdates } from "../../src/utils/useTicketListUpdates";

export const Route = createFileRoute("/_adminOnly/dashboard")({
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
	component: DashboardPage,
});

function DashboardPage() {
	const { data, totalPages, page } = Route.useLoaderData();
	const { sort, status, level } = Route.useSearch();

	return (
		<Dashboard
			tickets={data}
			totalPages={totalPages}
			page={page}
			sort={sort}
			status={status}
			level={level}
		/>
	);
}
