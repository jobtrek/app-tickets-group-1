import { lt } from "drizzle-orm";
import { cookies } from "./data/schema";
import { db } from "./db/database";
import { CommentRoutes } from "./routes/commentRoute";
import { LoginRoutes } from "./routes/loginRoute";
import { logoutRoutes } from "./routes/logoutRoute";
import { registerRoutes } from "./routes/registerRoute";
import { statisticsRoutes } from "./routes/statistics";
import { ticketRoutes } from "./routes/ticketsRoute";
import { uploadsRoutes } from "./routes/uploadsRoute";
import { UserRoutes } from "./routes/userRoute";
import { setServer } from "./utils/publisher";
import { handleWsUpgrade, websocketHandlers } from "./websocket";

const deleteExpiredSessions = () =>
	db.delete(cookies).where(lt(cookies.expiresAt, new Date()));

deleteExpiredSessions();
setInterval(deleteExpiredSessions, 60 * 60 * 1000);

const server = Bun.serve<{ ticketId: string | undefined }>({
	port: 3001,
	routes: {
		...LoginRoutes,
		...logoutRoutes,
		...statisticsRoutes,
		...UserRoutes,
		...registerRoutes,
		...ticketRoutes,
		...CommentRoutes,
		...uploadsRoutes,
	},

	fetch(req, server) {
		const { pathname } = new URL(req.url);
		if (pathname === "/ws") {
			return handleWsUpgrade(req, server);
		}
		return undefined;
	},

	websocket: websocketHandlers,
});

setServer(server);
