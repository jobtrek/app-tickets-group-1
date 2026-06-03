import { eq } from "drizzle-orm";
import * as v from "valibot";
import { users } from "../data/schema";
import { db } from "../db/database";
import type { AuthedRequest } from "../middleware/auth.middleware";
import { errorResponse, jsonResponse } from "../utils/responseFactory";
import { PasswordVerifySchema } from "../validators/passwordVerifyValidator";

export const verifyPassword = async (req: AuthedRequest): Promise<Response> => {
	const body = await req.json().catch(() => null);
	if (!body) return errorResponse("Invalid JSON", 400);

	const result = v.safeParse(PasswordVerifySchema, body);
	if (!result.success) return errorResponse("Validation failed", 400);

	const { password } = result.output;

	try {
		const [user] = await db
			.select({ password: users.password })
			.from(users)
			.where(eq(users.idUser, req.user.idUser))
			.limit(1);

		if (!user) return errorResponse("User not found", 404);

		const matches = await Bun.password
			.verify(password, user.password)
			.catch(() => false);

		if (!matches) return errorResponse("Invalid password", 401);

		return jsonResponse({ success: true });
	} catch (e) {
		console.error("Verify password error", e);
		return errorResponse("Internal Server Error", 500);
	}
};
