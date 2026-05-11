import type { TicketStore } from "../store/ticketStore";

export const getFilteredTickets = (state: TicketStore) => {
	let filtered = [...state.tickets];

	if (state.statusFilter.length > 0) {
		filtered = filtered.filter((t) =>
			state.statusFilter.includes(t.statusName),
		);
	}

	if (state.urgencyFilter.length > 0) {
		filtered = filtered.filter((t) =>
			state.urgencyFilter.includes(t.adminLevel ?? t.level),
		);
	}

	if (state.sort === "asc") {
		filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
	} else if (state.sort === "desc") {
		filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
	} else if (state.sort === "az") {
		filtered.sort((a, b) => a.title.localeCompare(b.title));
	}

	if (state.query) {
		filtered = filtered.filter((t) =>
			t.title.toLowerCase().includes(state.query.toLowerCase()),
		);
	}

	return filtered;
};
