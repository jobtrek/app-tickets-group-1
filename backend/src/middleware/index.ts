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
      }
    },
    
    }
})