import { db } from "../db/database";

const server = Bun.serve({
  port: 3001,
  routes: {
    "/api/tickets": {
      GET: (req) => {
        try {
          const tickets = db.query(`
            SELECT t.*, s.status_name 
            FROM ticket t 
            JOIN status s ON t.id_status = s.id_status
          `).all();
          
          return Response.json(tickets);
        } catch (e) {
          return new Response("DB Error", { status: 500 });
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
          `);

          insert.run(title, description, level, defaultStatus, id_user);

          return Response.json({ message: "Ticket created by user!" }, { 
            status: 201,
            headers: { "Access-Control-Allow-Origin": "*" } 
          });
        } catch (e) {
          return new Response("Error", { status: 400 });
        }
      }
    }
  }
});