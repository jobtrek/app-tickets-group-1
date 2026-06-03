import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Ticket } from "../utils/types";

export interface TicketStore {
	tickets: Ticket[];
	setTickets: (tickets: Ticket[]) => void;
	addTicket: (ticket: Ticket) => void;
	updateTicketInList: (idTicket: number, updates: Partial<Ticket>) => void;
	setSort: (sort: string) => void;
	sort: string;
	statusFilter: string[];
	urgencyFilter: string[];
	supportFilter: string;
	query: string;
	toggleStatusFilter: (status: Ticket["statusName"]) => void;
	toggleUrgencyFilter: (status: Ticket["level"]) => void;
	setSupportFilter: (username: string) => void;
	setQuery: (query: string) => void;
}

export const useTicketStore = create<TicketStore>()(
	persist(
		(set) => ({
			tickets: [],
			sort: "desc",
			statusFilter: [],
			urgencyFilter: [],
			supportFilter: "",
			query: "",
			setTickets: (tickets) => set({ tickets }),
			addTicket: (ticket) =>
				set((state) => ({ tickets: [ticket, ...state.tickets] })),
			updateTicketInList: (idTicket, updates) =>
				set((state) => ({
					tickets: state.tickets.map((t) =>
						t.idTicket === idTicket ? { ...t, ...updates } : t,
					),
				})),
			setSort: (sort) => set({ sort }),
			toggleStatusFilter: (status) =>
				set((state) => ({
					statusFilter: state.statusFilter.includes(status)
						? state.statusFilter.filter((s) => s !== status)
						: [...state.statusFilter, status],
				})),

			toggleUrgencyFilter: (urgency) =>
				set((state) => ({
					urgencyFilter: state.urgencyFilter.includes(urgency)
						? state.urgencyFilter.filter((u) => u !== urgency)
						: [...state.urgencyFilter, urgency],
				})),
			setSupportFilter: (username) => set({ supportFilter: username }),
			setQuery: (query) => set({ query }),
		}),
		{
			name: "ticket-store",
			partialize: (state) => ({
				sort: state.sort,
				statusFilter: state.statusFilter,
				urgencyFilter: state.urgencyFilter,
			}),
		},
	),
);
