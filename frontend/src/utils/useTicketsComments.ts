import { useEffect, useRef, useState } from "react";
import { getComments } from "../utils/ticketsApi";
import type { Comment } from "../utils/types";

export function useTicketComments(
	ticketId: number,
	onStatusUpdate?: (statusName: string) => void,
	onConfirmationUpdate?: (hasAdminConfirmed: boolean) => void,
	onAssignmentUpdate?: (supportUsername: string) => void,
) {
	// Stores the list of comments for the ticket
	const [comments, setComments] = useState<Comment[]>([]);
	// Ref to hold the latest onStatusUpdate callback without triggering re-renders
	const onStatusUpdateRef = useRef(onStatusUpdate);
	// Ref to hold the latest onConfirmationUpdate callback without triggering re-renders
	const onConfirmationUpdateRef = useRef(onConfirmationUpdate);
	// Ref to hold the latest onAssignmentUpdate callback without triggering re-renders
	const onAssignmentUpdateRef = useRef(onAssignmentUpdate);

	// Keeps the refs in sync with the latest callback props on every render
	useEffect(() => {
		onStatusUpdateRef.current = onStatusUpdate; // Update status callback ref
		onConfirmationUpdateRef.current = onConfirmationUpdate; // Update confirmation callback ref
		onAssignmentUpdateRef.current = onAssignmentUpdate; // Update assignment callback ref
	});

	useEffect(() => {
		// Fetch the initial list of comments for this ticket
		getComments(ticketId).then(setComments);

		const ws = new WebSocket(
			`${import.meta.env.VITE_WS_URL}/ws?ticketId=${ticketId}`,
		);

		ws.onmessage = (event) => {
			// Parse the raw WebSocket message payload
			const data = JSON.parse(event.data);
			if (data.type === "status_update") {
				// Notify the parent that the ticket's status has changed
				onStatusUpdateRef.current?.(data.statusName);
			} else if (data.type === "confirmation_update") {
				// Notify the parent that the admin confirmation state has changed
				onConfirmationUpdateRef.current?.(data.hasAdminConfirmed);
			} else if (data.type === "assignment_update") {
				// Notify the parent that the ticket has been assigned to a support user
				onAssignmentUpdateRef.current?.(data.supportUsername);
			} else {
				// Treat any other message as a new comment and append it to the list
				setComments((prev) => [...prev, data]);
			}
		};

		// Close the WebSocket when the component unmounts or ticketId changes
		return () => ws.close();
	}, [ticketId]); // Re-run this effect only when the ticketId changes

	// Expose the comments list to the consuming component
	return { comments };
}
