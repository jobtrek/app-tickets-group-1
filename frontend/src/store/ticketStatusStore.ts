import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TicketStatusStore {
	statusByTicketId: Record<number, string>;
	setTicketStatus: (ticketId: number, status: string) => void;
}

export const useTicketStatusStore = create<TicketStatusStore>()(
	persist(
		(set) => ({
			statusByTicketId: {},
			setTicketStatus: (ticketId, status) =>
				set((state) => ({
					statusByTicketId: { ...state.statusByTicketId, [ticketId]: status },
				})),
		}),
		{ name: "ticket-status-storage" },
	),
);
