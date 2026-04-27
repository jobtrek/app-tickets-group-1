import { corsHeaders } from "../../utils/headers";
import { isRateLimited } from "../utils/rateLimit";

type AnyHandler = (
	req: Request,
) => Response | Promise<Response | undefined> | undefined;

/**
 * @param handler
 * @param limit
 */

export const withRateLimit = <T extends AnyHandler>(
	handler: T,
	limit = process.env.NODE_ENV === "production" ? 60 : 500,
): T => {
	return (async (req: Request) => {
		const ip =
			req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
			req.headers.get("x-real-ip") ??
			"unknown";

		if (isRateLimited(ip, limit)) {
			return new Response(
				JSON.stringify({ error: "Too many requests, please try again later." }),
				{
					status: 429,
					headers: {
						...corsHeaders,
						"Retry-After": "60",
						"Content-Type": "application/json",
					},
				},
			);
		}

		return handler(req);
	}) as T;
};
