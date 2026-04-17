import * as v from "valibot";
import { eq } from "drizzle-orm";
import { corsHeaders } from "../../utils/headers";
import { comments, users } from "../data/schema";
import { db } from "../db/database";
import { publish, getServer } from "../utils/publisher";
import { commentQuery } from "../repositories/commentQuery";
import { CommentPostSchema } from "../validators/commentValidator";
export const postComment = async (req: Request) => {
	try {
		const body = await req.json();
		const validated = v.parse(CommentPostSchema, body);

		const [inserted] = await db
			.insert(comments)
			.values({
				idTicket: validated.idTicket,
				idUser: validated.idUser,
				userRole: "user",
				commentText: validated.commentText,
			})
			.returning();
		if(!inserted){
			return console.error('There was an error inserting your comment.');
		}
		const [fullComment] = await db
			.select({
				idComment: comments.idComment,
				commentText: comments.commentText,
				createdAt: comments.createdAt,
				authorId: comments.idUser,
				authorName: users.username,
				authorRole: users.role,
			})
			.from(comments)
			.innerJoin(users, eq(comments.idUser, users.idUser))
			.where(eq(comments.idComment, inserted.idComment));

		publish(`ticket-${inserted?.idTicket}`, JSON.stringify(fullComment));
		
		return new Response(JSON.stringify(inserted), {
			status: 201,
			headers: corsHeaders,
		});
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers: corsHeaders });
	}
};

export const getAllComment = async (req: Request) => {
	try {
		const id = new URL(req.url).pathname.split("/").at(-2);

		if (!id || Number.isNaN(Number(id))) {
			return new Response("Invalid or missing ticket ID", {
				status: 400,
				headers: corsHeaders,
			});
		}
		const comments = await commentQuery.getAll(Number(id));

		console.log("gettickets called.");
		return Response.json(comments, { status: 200, headers: corsHeaders });
	} catch (e) {
		console.error("getAllTickets error:", e);
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const websocketUpgrade = (req: Request) => {
	const id = new URL(req.url).pathname.split("/").at(-2);
	const success = getServer()?.upgrade(req, { data: { ticketId: id } });
	if (!success) return new Response("WS upgrade failed", { status: 400 });
};
