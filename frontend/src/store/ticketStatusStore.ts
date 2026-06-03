import { create } from "zustand";

interface TicketStatusStore {
	statusByTicketId: Record<number, string>;
	assignmentByTicketId: Record<number, string | null>;

	setTicketStatus: (ticketId: number, status: string) => void;
	setTicketAssignment: (
		ticketId: number,
		supportUsername: string | null,
	) => void;
}

export const useTicketStatusStore = create<TicketStatusStore>()((set) => ({
	statusByTicketId: {},
	assignmentByTicketId: {},
	setTicketStatus: (ticketId, status) =>
		set((state) => ({
			statusByTicketId: { ...state.statusByTicketId, [ticketId]: status },
		})),
	setTicketAssignment: (ticketId, supportUsername) =>
		set((state) => ({
			assignmentByTicketId: {
				...state.assignmentByTicketId,
				[ticketId]: supportUsername,
			},
		})),
}));
