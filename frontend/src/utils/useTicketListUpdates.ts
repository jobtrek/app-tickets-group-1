import { useEffect } from "react";
import { useTicketStore } from "../store/ticketStore";
import type { Ticket } from "./types";

export function useTicketListUpdates() {
	const addTicket = useTicketStore((state) => state.addTicket);
	const updateTicketInList = useTicketStore((state) => state.updateTicketInList);

	useEffect(() => {
		const origin = new URL(import.meta.env.VITE_API_URL).origin.replace(
			/^http/,
			"ws",
		);
		const ws = new WebSocket(`${origin}/ws`);

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "ticket_created") {
				addTicket(data.ticket as Ticket);
			} else if (data.type === "ticket_status_update") {
				updateTicketInList(data.idTicket, {
					statusName: data.statusName as Ticket["statusName"],
				});
			} else if (data.type === "ticket_assignment_update") {
				updateTicketInList(data.idTicket, {
					supportUsername: data.supportUsername,
				});
			}
		};

		return () => ws.close();
	}, [addTicket, updateTicketInList]);
}
