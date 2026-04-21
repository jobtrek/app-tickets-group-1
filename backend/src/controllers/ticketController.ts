import { mkdir } from "node:fs/promises";
import path from "node:path";
import { eq } from "drizzle-orm";
import { fileTypeFromBuffer } from "file-type";
import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { ticket_assignment, tickets } from "../data/schema";
import { db } from "../db/database";
import type { AuthedRequest } from "../middleware/auth.middleware";
import { updateStatusQuery } from "../repositories/statusQuery.ts";
import { ticketQueries } from "../repositories/ticketQuery";
import { publish } from "../utils/publisher";
import { TicketPostSchema } from "../validators/ticketValidator.ts";

const statusNames: Record<number, string> = {
	1: "Ouvert",
	2: "En cours",
	3: "Résolu",
	4: "Fermé",
};

export const getAllTickets = async (req: AuthedRequest) => {
	try {
		const allTickets =
			req.user.role === "admin"
				? await ticketQueries.getAll()
				: await ticketQueries.getAllByUser(req.user.idUser);

		return Response.json(allTickets, { status: 200, headers: corsHeaders });
	} catch (e) {
		console.error("DB fetch error", e);
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const getTicketById = async (
	req: AuthedRequest<"/api/ticket/:id">,
): Promise<Response> => {
	try {
		const id = req.params?.id;

		if (!id || Number.isNaN(Number(id))) {
			return new Response("Invalid or missing ID", {
				status: 400,
				headers: corsHeaders,
			});
		}

		const ticket = await ticketQueries.getById(Number(id));

		if (!ticket.length) {
			return new Response("Ticket not found", {
				status: 404,
				headers: corsHeaders,
			});
		}

		const ticketItem = ticket[0];

		if (!ticketItem) {
			return new Response("Ticket not found", {
				status: 404,
				headers: corsHeaders,
			});
		}

		if (req.user.role !== "admin" && ticketItem.idUser !== req.user.idUser) {
			return new Response("Forbidden", { status: 403, headers: corsHeaders });
		}

		return Response.json(ticketItem, { status: 200, headers: corsHeaders });
	} catch (e) {
		console.error("DB fetch error", e);
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const createTicket = async (req: AuthedRequest): Promise<Response> => {
	try {
		const formData = await req.formData();

		const rawData = {
			title: formData.get("title"),
			description: formData.get("description"),
			level: formData.get("level") || undefined,
			idUser: req.user.idUser,
		};

		const validBody = v.safeParse(TicketPostSchema, rawData);

		if (!validBody.success) {
			return Response.json(
				{ errors: validBody.issues.map((i) => i.message) },
				{ status: 400, headers: corsHeaders },
			);
		}

		let finalFileName: string | null = null;
		const file = formData.get("image") as File | null;

		if (file && file.size > 0) {
			if (file.size > 10 * 1024 * 1024) {
				return new Response("File too large (Max 10MB)", {
					status: 400,
					headers: corsHeaders,
				});
			}

			const arrayBuffer = await file.arrayBuffer();
			const buffer = new Uint8Array(arrayBuffer);
			const detectedType = await fileTypeFromBuffer(buffer);

			const allowedMimeTypes = [
				"image/png",
				"image/jpeg",
				"image/jpg",
				"image/webp",
			];

			if (!detectedType || !allowedMimeTypes.includes(detectedType.mime)) {
				return new Response("Security Error: Invalid file content.", {
					status: 400,
					headers: corsHeaders,
				});
			}

			const safeExt = `.${detectedType.ext}`;
			finalFileName = `${crypto.randomUUID()}${safeExt}`;
			const uploadDir = path.join(import.meta.dir, "..", "..", "uploads");

			await mkdir(uploadDir, { recursive: true });
			await Bun.write(path.join(uploadDir, finalFileName), buffer);
		}

		const { title, description, level, idUser } = validBody.output;
		const defaultStatus = 1;

		const result = await ticketQueries.insert(
			title,
			description,
			finalFileName,
			level ?? null,
			defaultStatus,
			idUser,
		);

		return Response.json(
			{ createdTicket: result[0] },
			{ status: 201, headers: corsHeaders },
		);
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 500, headers: corsHeaders });
	}
};

export const assignTicket = async (
	req: AuthedRequest<"/api/tickets/:id/assign">,
) => {
	if (req.user.role !== "admin") {
		return Response.json(
			{ error: "Forbidden" },
			{ status: 403, headers: corsHeaders },
		);
	}

	const idTicket = Number(req.params.id);
	if (!idTicket || Number.isNaN(idTicket)) {
		return Response.json(
			{ error: "Invalid ticket ID" },
			{ status: 400, headers: corsHeaders },
		);
	}

	const idSupport = req.user.idUser;

	await db.transaction(async (tx) => {
		await tx
			.insert(ticket_assignment)
			.values({ idTicket, idSupport, isActive: true });
		await tx
			.update(tickets)
			.set({ idSupport, idStatus: 2 })
			.where(eq(tickets.idTicket, idTicket));
	});

	return Response.json(
		{ message: "Ticket assigned" },
		{ status: 200, headers: corsHeaders },
	);
};

export const updateStatus = async (
	req: AuthedRequest<"/api/tickets/:id/status">,
) => {
	if (req.user.role !== "admin") {
		return Response.json(
			{ error: "Forbidden" },
			{ status: 403, headers: corsHeaders },
		);
	}

	const idTicket = Number(req.params.id);
	if (!idTicket || Number.isNaN(idTicket)) {
		return Response.json(
			{ error: "Invalid ticket ID" },
			{ status: 400, headers: corsHeaders },
		);
	}

	const { statusId } = await req.json();
	if (!Number.isInteger(statusId) || statusId < 1) {
		return Response.json(
			{ error: "Invalid statusId" },
			{ status: 400, headers: corsHeaders },
		);
	}

	await updateStatusQuery.update(statusId, idTicket);

	const statusName = statusNames[statusId];
	if (statusName) {
		publish(
			`ticket-${idTicket}`,
			JSON.stringify({ type: "status_update", statusName }),
		);
	}

	return Response.json(
		{ message: "Status updated" },
		{ status: 200, headers: corsHeaders },
	);
};

export const UpdateConfirmation = async (
	req: AuthedRequest<"/api/tickets/:id/confirm">,
) => {
	if (req.user.role !== "admin") {
		return Response.json(
			{ error: "Forbidden" },
			{ status: 403, headers: corsHeaders },
		);
	}

	const idTicket = Number(req.params.id);
	if (!idTicket || Number.isNaN(idTicket)) {
		return Response.json(
			{ error: "Invalid ticket ID" },
			{ status: 400, headers: corsHeaders },
		);
	}

	const hasAdminConfirmed = await ticketQueries.confirmed(idTicket);

	const newStatusId = hasAdminConfirmed ? 3 : 2;
	await updateStatusQuery.update(newStatusId, idTicket);

	publish(
		`ticket-${idTicket}`,
		JSON.stringify({ type: "confirmation_update", hasAdminConfirmed }),
	);

	return Response.json(
		{ message: "Ticket confirmation toggled", hasAdminConfirmed },
		{ status: 200, headers: corsHeaders },
	);
};

export const ownerConfirmTicket = async (
	req: AuthedRequest<"/api/tickets/:id/owner-confirm">,
) => {
	const idTicket = Number(req.params.id);
	if (!idTicket || Number.isNaN(idTicket)) {
		return Response.json(
			{ error: "Invalid ticket ID" },
			{ status: 400, headers: corsHeaders },
		);
	}

	const body = await req.json();
	const accepted: boolean = body.accepted;

	const ticket = await ticketQueries.getById(idTicket);
	if (!ticket.length || ticket[0]?.idUser !== req.user.idUser) {
		return Response.json(
			{ error: "Forbidden" },
			{ status: 403, headers: corsHeaders },
		);
	}

	const newStatusId = accepted ? 4 : 2;
	await updateStatusQuery.update(newStatusId, idTicket);

	if (!accepted) {
		await db
			.update(tickets)
			.set({ hasAdminConfirmed: false })
			.where(eq(tickets.idTicket, idTicket));
	}

	const statusName = statusNames[newStatusId];
	publish(
		`ticket-${idTicket}`,
		JSON.stringify({ type: "status_update", statusName }),
	);

	return Response.json(
		{ message: accepted ? "Ticket closed" : "Ticket reopened" },
		{ status: 200, headers: corsHeaders },
	);
};
