import { useEffect } from "react";
import { router } from "../router";
import { useTicketStatusStore } from "../store/ticketStatusStore";
import { useTicketStore } from "../store/ticketStore";
import type { Ticket } from "./types";

export function useTicketListUpdates() {
	const addTicket = useTicketStore((state) => state.addTicket);
	const updateTicketInList = useTicketStore(
		(state) => state.updateTicketInList,
	);
	const setTicketStatus = useTicketStatusStore(
		(state) => state.setTicketStatus,
	);
	const setTicketAssignment = useTicketStatusStore(
		(state) => state.setTicketAssignment,
	);

	useEffect(() => {
		const origin = new URL(import.meta.env.VITE_API_URL).origin.replace(
			/^http/,
			"ws",
		);
		const ws = new WebSocket(`${origin}/ws`);

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				if (data.type === "ticket_created") {
					router.invalidate();
				} else if (data.type === "ticket_status_update") {
					setTicketStatus(
						data.idTicket,
						data.statusName as Ticket["statusName"],
					);
				} else if (data.type === "ticket_assignment_update") {
					setTicketAssignment(data.idTicket, data.supportUsername);
				}
			} catch (error) {
				console.error("Failed to parse WebSocket message:", error);
			}
		};

		return () => ws.close();
	}, [addTicket, updateTicketInList]);
}
