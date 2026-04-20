import { LoginRoutes } from "./routes/loginRoute";
import { registerRoutes } from "./routes/registerRoute";
import { ticketRoutes } from "./routes/ticketsRoute";

const _server = Bun.serve({
	port: 3001,
	routes: {
		...ticketRoutes,
		...registerRoutes,
		...LoginRoutes,
	},
});