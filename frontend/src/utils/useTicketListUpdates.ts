import { useEffect } from "react";
import { router } from "../router";

export function useTicketListUpdates() {
	useEffect(() => {
		const origin = new URL(import.meta.env.VITE_API_URL).origin.replace(
			/^http/,
			"ws",
		);
		const ws = new WebSocket(`${origin}/ws`);

		ws.onmessage = (event) => {
			try {
				const data = JSON.parse(event.data);
				// Anything that can change list membership, status, assignment or
				// urgency requires re-running the server-side filtered/paginated
				// query — so just invalidate and let the route loader refetch.
				// This keeps the rows, the pagination count and the active filters
				// consistent instead of patching individual cells client-side.
				if (
					data.type === "ticket_created" ||
					data.type === "ticket_status_update" ||
					data.type === "ticket_assignment_update" ||
					data.type === "ticket_urgency_update"
				) {
					router.invalidate();
				}
			} catch (error) {
				console.error("Failed to parse WebSocket message:", error);
			}
		};

		return () => ws.close();
	}, []);
}
