import { basename, join } from "node:path";
import { errorResponse, jsonResponse } from "../utils/responseFactory";

export const serveUpload = async (req: Bun.BunRequest<"/uploads/:file">) => {
	const fileName = basename(req.params.file);
	const filePath = join(import.meta.dir, "..", "..", "uploads", fileName);
	const file = Bun.file(filePath);

	if (await file.exists()) {
		return jsonResponse(file);
	}
	return errorResponse("Not Found", 404);
};
