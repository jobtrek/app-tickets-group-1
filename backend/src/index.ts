import { ticketRoutes } from "./routes/tickets.route";
import { registerRoutes } from "./routes/register.route";
const _server = Bun.serve({
	port: 3001,
	routes: {
		...ticketRoutes,
		...registerRoutes
	}
	
});
