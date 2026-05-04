import * as v from "valibot";
import type { AuthedRequest } from "../middleware/auth.middleware";
import { updateStatusQuery } from "../repositories/statusQuery.ts";
import { ticketQueries } from "../repositories/ticketQuery";
import { userQueries } from "../repositories/userQuery";
import { statusNames } from "../utils/constants/statusNames";
import { verifyAndParseId } from "../utils/idParser";
import { handleImageUpload } from "../utils/imageHandling.ts";
import { publish } from "../utils/publisher";
import {
	publishTicketUpdate,
	requireAdmin,
} from "../utils/publishTicketUpdate.ts";
import { errorResponse, jsonResponse } from "../utils/responseFactory";
import { TicketPostSchema } from "../validators/ticketValidator.ts";

export const getAllTickets = async (req: AuthedRequest) => {
	try {
		const allTickets =
			req.user.role === "admin"
				? await ticketQueries.getAll()
				: await ticketQueries.getAllByUser(req.user.idUser);
		return jsonResponse(allTickets);
	} catch (e) {
		console.error("DB fetch error", e);
		return errorResponse("DB Error", 500);
	}
};

export const getTicketById = async (
	req: AuthedRequest<"/api/ticket/:id">,
): Promise<Response> => {
	try {
		const id = verifyAndParseId(req.params?.id ?? "", "Invalid or missing ID");
		if (id instanceof Response) return id;

		const [ticket] = await ticketQueries.getById(id);
		if (!ticket) return errorResponse("Ticket not found", 404);
		if (req.user.role !== "admin" && ticket.idUser !== req.user.idUser) {
			return errorResponse("Forbidden", 403);
		}

		return jsonResponse(ticket);
	} catch (e) {
		console.error("DB fetch error", e);
		return errorResponse("DB Error", 500);
	}
};

export const createTicket = async (req: AuthedRequest): Promise<Response> => {
	try {
		const formData = await req.formData();
		const validBody = v.safeParse(TicketPostSchema, {
			title: formData.get("title"),
			description: formData.get("description"),
			level: formData.get("level") || undefined,
			idUser: req.user.idUser,
		});

		if (!validBody.success) {
			return jsonResponse(
				{ errors: validBody.issues.map((i) => i.message) },
				400,
			);
		}

		let finalFileName: string | null = null;
		const file = formData.get("image") as File | null;

		if (file && file.size > 0) {
			const result = await handleImageUpload(file);
			if (result instanceof Response) return result;
			finalFileName = result;
		}

		const { title, description, level, idUser } = validBody.output;
		const result = await ticketQueries.insert(
			title,
			description,
			finalFileName,
			level ?? null,
			1,
			idUser,
		);
		const inserted = result[0];

		if (inserted) {
			const [fullTicket] = await ticketQueries.getById(inserted.idTicket);
			if (fullTicket)
				publish(
					"tickets",
					JSON.stringify({ type: "ticket_created", ticket: fullTicket }),
				);
		}

		return jsonResponse({ createdTicket: inserted }, 201);
	} catch (e) {
		console.error("DB insertion error", e);
		return errorResponse("Error", 500);
	}
};

export const assignTicket = async (
	req: AuthedRequest<"/api/tickets/:id/assign">,
) => {
	const guard = requireAdmin(req);
	if (guard) return guard;

	const idTicket = verifyAndParseId(req.params.id, "Invalid ticket ID");
	if (idTicket instanceof Response) return idTicket;

	const { idSupport } = await req.json().catch(() => ({}));
	if (!idSupport || Number.isNaN(Number(idSupport))) {
		return jsonResponse({ error: "Invalid idSupport" }, 400);
	}

	const supportUser = await userQueries.getSupportById(idSupport);

	if (!supportUser || supportUser.role !== "admin") {
		return jsonResponse(
			{ error: "L'utilisateur sélectionné n'est pas un admin" },
			403,
		);
	}

	await ticketQueries.assign(idTicket, idSupport);

	publishTicketUpdate(idTicket, "assignment_update", {
		supportUsername: supportUser.username,
	});
	return jsonResponse({
		message: "Ticket assigned",
		supportUsername: supportUser.username,
	});
};

export const updateStatus = async (
	req: AuthedRequest<"/api/tickets/:id/status">,
) => {
	const guard = requireAdmin(req);
	if (guard) return guard;

	const idTicket = verifyAndParseId(req.params.id, "Invalid ticket ID");
	if (idTicket instanceof Response) return idTicket;

	const { statusId } = await req.json();
	if (!Number.isInteger(statusId) || statusId < 1) {
		return jsonResponse({ error: "Invalid statusId" }, 400);
	}

	await updateStatusQuery.update(statusId, idTicket);

	const statusName = statusNames[statusId];
	if (statusName)
		publishTicketUpdate(idTicket, "status_update", { statusName });

	return jsonResponse({ message: "Status updated" });
};

export const UpdateConfirmation = async (
	req: AuthedRequest<"/api/tickets/:id/confirm">,
) => {
	const guard = requireAdmin(req);
	if (guard) return guard;

	const idTicket = verifyAndParseId(req.params.id, "Invalid ticket ID");
	if (idTicket instanceof Response) return idTicket;

	const { hasAdminConfirmed } = await req.json().catch(() => ({}));
	if (typeof hasAdminConfirmed !== "boolean") {
		return jsonResponse({ error: "hasAdminConfirmed must be a boolean" }, 400);
	}

	const result = await ticketQueries.confirmed(idTicket, hasAdminConfirmed);
	publish(
		`ticket-${idTicket}`,
		JSON.stringify({ type: "confirmation_update", hasAdminConfirmed: result }),
	);

	return jsonResponse({
		message: "Ticket confirmation updated",
		hasAdminConfirmed: result,
	});
};

export const ownerConfirmTicket = async (
	req: AuthedRequest<"/api/tickets/:id/owner-confirm">,
) => {
	const idTicket = verifyAndParseId(req.params.id, "Invalid ticket ID");
	if (idTicket instanceof Response) return idTicket;

	const { accepted } = await req.json();
	const [ticket] = await ticketQueries.getById(idTicket);

	if (!ticket || ticket.idUser !== req.user.idUser) {
		return jsonResponse({ error: "Forbidden" }, 403);
	}

	const newStatusId = accepted ? 4 : 2;
	await updateStatusQuery.update(newStatusId, idTicket);

	if (!accepted) {
		await ticketQueries.confirmed(idTicket, false);
	}

	publish(
		`ticket-${idTicket}`,
		JSON.stringify({
			type: "status_update",
			statusName: statusNames[newStatusId],
		}),
	);
	return jsonResponse({
		message: accepted ? "Ticket closed" : "Ticket reopened",
	});
};

export const getAllAdmins = async (
	req: AuthedRequest<"/api/tickets/admin">,
) => {
	const guard = requireAdmin(req);
	if (guard) return guard;

	const admins = await ticketQueries.getAllSupport();
	return jsonResponse({ admins });
};
