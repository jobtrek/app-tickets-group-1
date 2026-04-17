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
