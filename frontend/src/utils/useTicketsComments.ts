import { useEffect, useRef, useState } from "react";
import { getComments } from "../utils/ticketsApi";
import type { Comment } from "../utils/types";

export function useTicketComments(
	ticketId: number,
	onStatusUpdate?: (statusName: string) => void,
	onConfirmationUpdate?: (hasAdminConfirmed: boolean) => void,
	onAssignmentUpdate?: (supportUsername: string) => void,
	onUrgencyUpdate?: (level: string) => void,
) {
	const [comments, setComments] = useState<Comment[]>([]);
	const onStatusUpdateRef = useRef(onStatusUpdate);
	const onConfirmationUpdateRef = useRef(onConfirmationUpdate);
	const onAssignmentUpdateRef = useRef(onAssignmentUpdate);
	const onUrgencyUpdateRef = useRef(onUrgencyUpdate);

	useEffect(() => {
		onStatusUpdateRef.current = onStatusUpdate;
		onConfirmationUpdateRef.current = onConfirmationUpdate;
		onAssignmentUpdateRef.current = onAssignmentUpdate;
		onUrgencyUpdateRef.current = onUrgencyUpdate;
	});

	useEffect(() => {
		getComments(ticketId).then(setComments);

		const ws = new WebSocket(
			`${import.meta.env.VITE_WS_URL}/ws?ticketId=${ticketId}`,
		);

		ws.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.type === "status_update") {
				onStatusUpdateRef.current?.(data.statusName);
			} else if (data.type === "confirmation_update") {
				onConfirmationUpdateRef.current?.(data.hasAdminConfirmed);
			} else if (data.type === "assignment_update") {
				onAssignmentUpdateRef.current?.(data.supportUsername);
			} else if (data.type === "urgency_update") {
				onUrgencyUpdateRef.current?.(data.level);
			} else {
				setComments((prev) => [...prev, data]);
			}
		};

		return () => ws.close();
	}, [ticketId]);

	return { comments };
}
