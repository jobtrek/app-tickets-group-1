import { db } from '../db/database';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Prefer',
};

const server = Bun.serve({
  port: 3001,
  routes: {
    '/api/tickets': {
      OPTIONS: (req) => {
        return new Response(null, { headers, status: 204 });
      },
      GET: (req) => {
        console.log('HELL FROM GET TICKETS');

        try {
          const tickets = db.query(
            `
            SELECT t.*

            FROM ticket t 

          `,
          );

          return Response.json(tickets, { status: 200, headers });
        } catch (e) {
          return new Response('DB Error', { status: 500, headers });
        }
      },
      POST: async (req) => {
        try {
          const body = await req.json();
          const { title, description, level, id_user } = body;

          const defaultStatus = 1;

          const insert = db.prepare(`
            INSERT INTO ticket (title, description, level, id_status, id_user)
            VALUES (?, ?, ?, ?, ?)
            RETURNING *
          `);

          const result = insert.run(
            title,
            description,
            level,
            defaultStatus,
            id_user,
          );

          return Response.json(
            { result },
            {
              status: 201,
              headers,
            },
          );
        } catch (e) {
          console.error('Erreur insertion DB:', e); // <--- AJOUTE CECI
          return new Response('Error', { status: 400, headers });
        }
      },
    },
  },
});
