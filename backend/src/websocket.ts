import type { Server, ServerWebSocket } from "bun";
import { getSessionUser } from "./middleware/auth.middleware";
import { ticketQueries } from "./repositories/ticketQuery";

type WsData = { ticketId: string | undefined };

const ALLOWED_ORIGIN = process.env.FRONTEND_URL ?? "http://localhost:5173";

export const handleWsUpgrade = async (
	req: Request,
	server: Server<WsData>,
): Promise<Response | undefined> => {
	const origin = req.headers.get("origin");
	if (origin && origin !== ALLOWED_ORIGIN) {
		return new Response("Forbidden", { status: 403 });
	}

	const user = await getSessionUser(req);
	if (!user) {
		return new Response("Unauthorized", { status: 401 });
	}

	const ticketIdParam = new URL(req.url).searchParams.get("ticketId");

	if (ticketIdParam !== null) {
		const idTicket = Number(ticketIdParam);
		if (!Number.isInteger(idTicket) || idTicket <= 0) {
			return new Response("Bad Request", { status: 400 });
		}

		const [ticket] = await ticketQueries.getById(idTicket);
		if (!ticket) {
			return new Response("Not Found", { status: 404 });
		}

		if (user.role !== "admin" && ticket.idUser !== user.idUser) {
			return new Response("Forbidden", { status: 403 });
		}
	}

	server.upgrade(req, { data: { ticketId: ticketIdParam ?? undefined } });
	return undefined;
};

export const websocketHandlers = {
	open(ws: ServerWebSocket<WsData>) {
		const channel = ws.data.ticketId ? `ticket-${ws.data.ticketId}` : "tickets";
		ws.subscribe(channel);
	},
	close(ws: ServerWebSocket<WsData>) {
		const channel = ws.data.ticketId ? `ticket-${ws.data.ticketId}` : "tickets";
		ws.unsubscribe(channel);
	},
	message() {
		// Clients send comments via HTTP POST, so this is intentionally empty.
	},
};
