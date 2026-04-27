import { corsHeaders } from "../../utils/headers";
import { isRateLimited } from "../utils/rateLimit";

/**
 * @param handler
 * @param limit
 */

export const withRateLimit = <T extends string = string>(
	handler: (
		req: Bun.BunRequest<T>,
	) => Response | Promise<Response | undefined> | undefined,
	limit = process.env.NODE_ENV === "production" ? 60 : 500,
) => {
	return async (req: Bun.BunRequest<T>): Promise<Response> => {
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

		return (
			(await handler(req)) ??
			Response.json({ error: "No response" }, { status: 500 })
		);
	};
};
