import type { TicketStore } from "../store/ticketStore";
import type { Ticket } from "./types";

export const getFilteredUserTickets =
	(userId: number) => (state: TicketStore) => {
		const tickets = [...state.tickets];

		let filtered = tickets.filter((t: Ticket) => t.idUser === userId);

		if (state.statusFilter.length > 0) {
			filtered = filtered.filter((t) =>
				state.statusFilter.includes(t.statusName),
			);
		}

		if (state.urgencyFilter.length > 0) {
			filtered = filtered.filter((t) => state.urgencyFilter.includes(t.level));
		}

		if (state.sort === "asc") {
			filtered.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
		} else if (state.sort === "desc") {
			filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
		} else if (state.sort === "az") {
			filtered.sort((a, b) => a.title.localeCompare(b.title));
		}

		return filtered;
	};
