import { create } from "zustand";
import type { Ticket } from "../utils/types";

export interface TicketStore {
	tickets: Ticket[];
	setTickets: (tickets: Ticket[]) => void;
	setSort: (sort: string) => void;
	sort: string;
	statusFilter: string[];
	urgencyFilter: string[];
	toggleStatusFilter: (status: string) => void;
	toggleUrgencyFilter: (status: string) => void;
}

export const useTicketStore = create<TicketStore>((set) => ({
	tickets: [],
	sort: "",
	statusFilter: [],
	urgencyFilter: [],
	setTickets: (tickets) => set({ tickets }),
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
}));
