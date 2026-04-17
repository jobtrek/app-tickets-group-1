import { fileTypeFromBuffer } from "file-type";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { ticketQueries } from "../repositories/ticketQuery";
import { TicketPostSchema } from "../validators/ticketValidator.ts";

export const getAllTickets = async () => {
	try {
		const tickets = await ticketQueries.getAll();
		return Response.json(tickets, { status: 200, headers: corsHeaders });
	} catch (_e) {
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const getTicketById = async (req: Request): Promise<Response> => {
	try {
		const id = new URL(req.url).pathname.split("/").at(-1);

		if (!id || isNaN(Number(id))) {
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

		return Response.json(ticket[0], { status: 200, headers: corsHeaders });
	} catch (_e) {
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};

export const createTicket = async (req: Request): Promise<Response> => {
	try {
		const formData = await req.formData();
		const rawData = {
			title: formData.get("title"),
			description: formData.get("description"),
			level: formData.get("level") || undefined,
			idUser: Number(formData.get("idUser")),
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
				return new Response(
					"Security Error: Invalid file content. Real images only.",
					{
						status: 400,
						headers: corsHeaders,
					},
				);
			}

			if (file.size > 10 * 1024 * 1024) {
				return new Response("File too large (Max 10MB)", {
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
			{
				status: 201,
				headers: corsHeaders,
			},
		);
	} catch (e) {
		console.error("Critical Server Error:", e);
		return new Response("Internal Server Error", {
			status: 500,
			headers: corsHeaders,
		});
	}
};
