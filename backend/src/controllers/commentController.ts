import * as v from "valibot";
import { commentQuery } from "../repositories/commentQuery";
import { verifyAndParseId } from "../utils/idParser";
import { getServer, publish } from "../utils/publisher";
import { errorResponse, jsonResponse } from "../utils/responseFactory";
import { CommentPostSchema } from "../validators/commentValidator";

export const postComment = async (req: Request) => {
	try {
		const validated = v.parse(CommentPostSchema, await req.json());
		const inserted = await commentQuery.insert(validated);
		const fullComment = await commentQuery.getById(inserted.idComment);
		publish(`ticket-${inserted.idTicket}`, JSON.stringify(fullComment));
		return jsonResponse(fullComment, 201);
	} catch (e) {
		console.error("postComment error", e);
		return errorResponse("Error creating comment", 400);
	}
};

export const getAllComment = async (
	req: Bun.BunRequest<"/api/tickets/:id/comment">,
) => {
	try {
		const id = verifyAndParseId(req.params.id, "Invalid or missing ticket ID");
		if (id instanceof Response) return id;

		const comments = await commentQuery.getAll(id);
		return jsonResponse(comments);
	} catch (e) {
		console.error("getAllComment error:", e);
		return errorResponse("DB Error", 500);
	}
};

export const websocketUpgrade = (
	req: Bun.BunRequest<"/api/tickets/:id/ws">,
) => {
	const success = getServer()?.upgrade(req, {
		data: { ticketId: req.params.id },
	});
	if (!success) return errorResponse("WS upgrade failed", 400);
};
