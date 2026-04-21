import { useEffect, useRef, useState } from "react";
import { getComments } from "../utils/ticketsApi";
import type { Comment } from "../utils/types";

export function useTicketComments(
	ticketId: number,
	onStatusUpdate?: (statusName: string) => void,
	onConfirmationUpdate?: (hasAdminConfirmed: boolean) => void,
	onAssignmentUpdate?: (supportUsername: string) => void,
) {
	const [comments, setComments] = useState<Comment[]>([]);
	const onStatusUpdateRef = useRef(onStatusUpdate);
	const onConfirmationUpdateRef = useRef(onConfirmationUpdate);
	const onAssignmentUpdateRef = useRef(onAssignmentUpdate);

	useEffect(() => {
		onStatusUpdateRef.current = onStatusUpdate;
		onConfirmationUpdateRef.current = onConfirmationUpdate;
		onAssignmentUpdateRef.current = onAssignmentUpdate;
	});

	useEffect(() => {
		getComments(ticketId).then(setComments);

		const origin = new URL(import.meta.env.VITE_API_URL).origin.replace(
			/^http/,
			"ws",
		);
		const ws = new WebSocket(`${origin}/ws?ticketId=${ticketId}`);

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "status_update") {
				onStatusUpdateRef.current?.(data.statusName);
			} else if (data.type === "confirmation_update") {
				onConfirmationUpdateRef.current?.(data.hasAdminConfirmed);
			} else if (data.type === "assignment_update") {
				onAssignmentUpdateRef.current?.(data.supportUsername);
			} else {
				setComments((prev) => [...prev, data]);
			}
		};

		return () => ws.close();
	}, [ticketId]);

	return { comments };
}
