import { eq } from "drizzle-orm";
import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { comments, users } from "../data/schema";
import { db } from "../db/database";
import { commentQuery } from "../repositories/commentQuery";
import { getServer, publish } from "../utils/publisher";
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
		if (!inserted) {
			console.error("Comment insertion failed to return the new record.");
			return new Response("Error creating comment", {
				status: 500,
				headers: corsHeaders,
			});
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

		return new Response(JSON.stringify(fullComment), {
			status: 201,
			headers: corsHeaders,
		});
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers: corsHeaders });
	}
};

export const getAllComment = async (
	req: Bun.BunRequest<"/api/tickets/:id/comment">,
) => {
	try {
		const id = req.params.id;

		if (Number.isNaN(Number(id))) {
			return new Response("Invalid or missing ticket ID", {
				status: 400,
				headers: corsHeaders,
			});
		}
		const comments = await commentQuery.getAll(Number(id));
		return Response.json(comments, { status: 200, headers: corsHeaders });
	} catch (e) {
		console.error("getAllComment error:", e);
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const websocketUpgrade = (req: Bun.BunRequest<"/api/tickets/:id/ws">) => {
	const success = getServer()?.upgrade(req, {
		data: { ticketId: req.params.id },
	});
	if (!success) return new Response("WS upgrade failed", { status: 400 });
};
