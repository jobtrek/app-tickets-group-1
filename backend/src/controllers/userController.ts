import * as v from "valibot";
import { updateUserQuery } from "../repositories/updateUserQuery";
import { parseId } from "../utils/idParser";
import { errorResponse, jsonResponse } from "../utils/responseFactory";
import { UpdateUserSchema } from "../validators/authValidator";

export const updateUserById = async (
	req: Bun.BunRequest<"/api/user/:id">,
): Promise<Response> => {
	const userId = parseId(req.params.id);
	if (!userId) return errorResponse("Invalid ID", 400);

	const body = await req.json().catch(() => null);
	if (!body) return errorResponse("Invalid JSON", 400);

	const result = v.safeParse(UpdateUserSchema, body);
	if (!result.success) return errorResponse("Validation failed", 400);

	const { username, email, password } = result.output;
	if (!username && !email && !password) {
		return errorResponse("No fields to update", 400);
	}

	try {
		const hashedPassword = password
			? await Bun.password.hash(password)
			: undefined;

		const [updated] = await updateUserQuery.update(
			userId,
			username,
			email,
			hashedPassword,
		);

		if (!updated) return errorResponse("User not found", 404);
		const { password: _pwd, ...safeUser } = updated;
		return jsonResponse(safeUser);
	} catch (e) {
		console.error("Update user error", e);
		return errorResponse("Internal Server Error", 500);
	}
};
