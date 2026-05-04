import type { AuthedRequest } from "../middleware/auth.middleware";
import { jsonResponse } from "./responseFactory";
import { publish } from "./publisher";

export const publishTicketUpdate = (
	idTicket: number,
	type: string,
	payload: object,
) => {
	const data = JSON.stringify({ type, ...payload });
	publish(`ticket-${idTicket}`, data);
	publish(
		"tickets",
		JSON.stringify({ type: `ticket_${type}`, idTicket, ...payload }),
	);
};

export const requireAdmin = (req: AuthedRequest): Response | null => {
	if (req.user.role !== "admin") {
		return jsonResponse({ error: "Forbidden" }, 403);
	}
	return null;
};
