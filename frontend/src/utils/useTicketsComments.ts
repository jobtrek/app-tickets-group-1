import { useEffect, useState } from "react";
import { getComments } from "../utils/ticketsApi";
import type { Comment } from "../utils/types";

export function useTicketComments(ticketId: number) {
	const [comments, setComments] = useState<Comment[]>([]);

	useEffect(() => {
		getComments(ticketId).then(setComments);

		const wsBaseUrl = import.meta.env.VITE_API_URL.replace(/^http/, "ws");
		const ws = new WebSocket(`${wsBaseUrl}/${ticketId}/ws`);
		ws.onmessage = (event) => {
			const comment = JSON.parse(event.data);
			setComments((prev) => [...prev, comment]);
		};
		return () => ws.close();
	}, [ticketId]);

	return { comments };
}
