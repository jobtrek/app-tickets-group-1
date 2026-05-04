import { basename, join } from "node:path";
import { corsHeaders } from "../utils/headers";

export const serveUpload = async (req: Bun.BunRequest<"/uploads/:file">) => {
	const fileName = basename(req.params.file);
	const filePath = join(import.meta.dir, "..", "..", "uploads", fileName);
	const file = Bun.file(filePath);

	if (await file.exists()) {
		return new Response(file, { headers: corsHeaders });
	}
	return new Response("Not Found", { status: 404, headers: corsHeaders });
};
