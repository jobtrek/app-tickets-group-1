import { serveUpload } from "../controllers/uploadsController";
import { corsHeaders } from "../utils/headers";

export const uploadsRoutes = {
	"/uploads/:file": {
		OPTIONS: (_req: Request) =>
			new Response(null, { headers: corsHeaders, status: 204 }),
		GET: serveUpload,
	},
};
