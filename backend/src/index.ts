import { basename, join } from "node:path";
import { corsHeaders } from "backend/utils/headers";
import { CommentRoutes } from "./routes/commentRoute";
import { LoginRoutes } from "./routes/loginRoute";
import { registerRoutes } from "./routes/registerRoute";
import { ticketRoutes } from "./routes/ticketsRoute";
import { setServer } from "./utils/publisher";

const server = Bun.serve<{ ticketId: string | undefined }>({
	port: 3001,
	routes: {
		...ticketRoutes,
		...registerRoutes,
		...LoginRoutes,
		...CommentRoutes,
	},
	async fetch(req, server) {
		const url = new URL(req.url);
		const path = url.pathname;

		if (req.method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}

		if (path.startsWith("/uploads/")) {
			const fileName = basename(path);
			const filePath = join(import.meta.dir, "..", "uploads", fileName);
			const file = Bun.file(filePath);

			if (await file.exists()) {
				return new Response(file, { headers: corsHeaders });
			}
			return new Response("Not Found", { status: 404, headers: corsHeaders });
		}

		if (path === "/ws") {
			const ticketId = url.searchParams.get("ticketId") || undefined;
			if (server.upgrade(req, { data: { ticketId } })) {
				return;
			}
		}

		return undefined;
	},

	websocket: {
		open(ws) {
			if (ws.data.ticketId) {
				ws.subscribe(`ticket-${ws.data.ticketId}`);
			}
		},
		close(ws) {
			ws.unsubscribe(`ticket-${ws.data.ticketId}`);
		},
		message() {
			// Clients send comments via HTTP POST, so this is intentionally empty.
		},
	},
});

setServer(server);
