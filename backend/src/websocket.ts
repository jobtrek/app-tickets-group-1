import type { Server, ServerWebSocket } from "bun";

type WsData = { ticketId: string | undefined };

const ALLOWED_ORIGIN = process.env.FRONTEND_URL ?? "http://localhost:5173";

export const handleWsUpgrade = (
	req: Request,
	server: Server<WsData>,
): Response | undefined => {
	const origin = req.headers.get("origin");
	if (origin && origin !== ALLOWED_ORIGIN) {
		return new Response("Forbidden", { status: 403 });
	}

	const cookieHeader = req.headers.get("cookie");
	const sessionToken = cookieHeader
		?.split(";")
		.find((c) => c.trim().startsWith("session="))
		?.split("=")[1]
		?.trim();

	if (!sessionToken) {
		return new Response("Unauthorized", { status: 401 });
	}

	const ticketId = new URL(req.url).searchParams.get("ticketId") || undefined;
	server.upgrade(req, { data: { ticketId } });
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
