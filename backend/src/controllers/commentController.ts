import * as v from "valibot";
import type { AuthedRequest } from "../middleware/auth.middleware";
import { commentQuery } from "../repositories/commentQuery";
import { ticketQueries } from "../repositories/ticketQuery";
import { verifyAndParseId } from "../utils/idParser";
import { publish } from "../utils/publisher";
import { errorResponse, jsonResponse } from "../utils/responseFactory";
import { CommentPostSchema } from "../validators/commentValidator";

export const postComment = async (
	req: AuthedRequest<"/api/tickets/:id/comment">,
) => {
	try {
		const idTicket = verifyAndParseId(req.params.id, "Invalid ticket ID");
		if (idTicket instanceof Response) return idTicket;

		const [ticket] = await ticketQueries.getById(idTicket);
		if (!ticket) return errorResponse("Ticket not found", 404);
		if (req.user.role !== "admin" && ticket.idUser !== req.user.idUser) {
			return errorResponse("Forbidden", 403);
		}

		const validated = v.parse(CommentPostSchema, await req.json());
		const inserted = await commentQuery.insert({
			...validated,
			idTicket,
			idUser: req.user.idUser,
			userRole: req.user.role,
		});
		const fullComment = await commentQuery.getById(inserted.idComment);
		publish(`ticket-${inserted.idTicket}`, JSON.stringify(fullComment));
		return jsonResponse(fullComment, 201);
	} catch (e) {
		console.error("postComment error", e);
		return errorResponse("Error creating comment", 400);
	}
};

export const getAllComment = async (
	req: AuthedRequest<"/api/tickets/:id/comment">,
) => {
	const id = verifyAndParseId(req.params.id, "Invalid or missing ticket ID");
	if (id instanceof Response) return id;

	const [ticket] = await ticketQueries.getById(id);
	if (!ticket) return errorResponse("Ticket not found", 404);
	if (req.user.role !== "admin" && ticket.idUser !== req.user.idUser) {
		return errorResponse("Forbidden", 403);
	}

	const comments = await commentQuery.getAll(id);
	return jsonResponse(comments);
};
