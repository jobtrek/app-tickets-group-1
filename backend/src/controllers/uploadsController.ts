import { basename, join } from "node:path";
import { corsHeaders } from "../utils/headers";
import { errorResponse } from "../utils/responseFactory";

export const serveUpload = async (req: Bun.BunRequest<"/uploads/:file">) => {
	const fileName = basename(req.params.file);
	const filePath = join(import.meta.dir, "..", "..", "uploads", fileName);
	const file = Bun.file(filePath);

	if (await file.exists()) {
		const headers = new Headers(corsHeaders);
		headers.set("Content-Type", file.type);
		return new Response(file, { headers });
	}
	return errorResponse("Not Found", 404);
};
