import { corsHeaders } from "backend/utils/headers";
import { basename, join } from "node:path";
import { LoginRoutes } from "./routes/loginRoute";
import { registerRoutes } from "./routes/registerRoute";
import { ticketRoutes } from "./routes/ticketsRoute";

const allRoutes: Record<
	string,
	Record<string, (req: Request) => Response | Promise<Response>>
> = {
	...ticketRoutes,
	...registerRoutes,
	...LoginRoutes,
};

const _server = Bun.serve({
	port: 3001,
	async fetch(req) {
		const url = new URL(req.url);
		const path = url.pathname;
		const method = req.method;

		if (method === "OPTIONS") {
			return new Response(null, { headers: corsHeaders });
		}

		// --- PROTECTION DES UPLOADS ---
		if (path.startsWith("/uploads/")) {
			const fileName = basename(path);
			const filePath = join(import.meta.dir, "..", "uploads", fileName);

			const file = Bun.file(filePath);

			if (await file.exists()) {
				return new Response(file, { headers: corsHeaders });
			}
			return new Response("Image not found", {
				status: 404,
				headers: corsHeaders,
			});
		}

		if (allRoutes[path]?.[method]) {
			return allRoutes[path][method](req);
		}

		if (path.startsWith("/api/ticket/")) {
			const ticketRoute = ticketRoutes["/api/ticket/:id"];
			return (
				ticketRoute?.[method as keyof typeof ticketRoute]?.(req) ??
				new Response("Not Found", { status: 404, headers: corsHeaders })
			);
		}

		return new Response("Not Found", { status: 404, headers: corsHeaders });
	},
});

console.log(`Server running at ${_server.url}`);
