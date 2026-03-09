import { db } from "./db/database";

const headers = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Prefer",
};

const _server = Bun.serve({
	port: 3001,
	routes: {
		"/api/tickets": {
			OPTIONS: (_req) => {
				return new Response(null, { headers, status: 204 });
			},
			GET: (_req) => {
				console.log("HELL FROM GET TICKETS");

				try {
					const tickets = db
						.query(
							`
            SELECT t.*

            FROM tickets t 

          `,
						)
						.all();

					return Response.json(tickets, { status: 200, headers });
				} catch (_e) {
					return new Response("DB Error", { status: 500, headers });
				}
			},
			POST: async (req) => {
				try {
					const body = await req.json();
					const { title, description, urgency, id_user } = body;

					const defaultStatus = 1;

					const insert = db.prepare(`
            INSERT INTO tickets (title, description, urgency, id_status, id_user)
            VALUES (?, ?, ?, ?, ?)
            RETURNING *
          `);

					const result = insert.get(
						title,
						description,
						urgency,
						defaultStatus,
						id_user,
					);

					return Response.json(result, {
						status: 201,
						headers,
					});
				} catch (e) {
					console.error("Erreur insertion DB:", e); // <--- AJOUTE CECI
					return new Response("Error", { status: 400, headers });
				}
			},
		},
	},
});
