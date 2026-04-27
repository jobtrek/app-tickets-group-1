import { corsHeaders } from "../../utils/headers";
import { updateUserQuery } from "../repositories/updateUserQuery";

export const updateUserById = async (
	req: Bun.BunRequest<"/api/user/:id">,
): Promise<Response> => {
	try {
		const userId = Number(req.params.id);
		if (Number.isNaN(userId) || !Number.isInteger(userId) || userId <= 0) {
			throw new Error(`Invalid ID: "${userId}" must be a positive integer.`);
		}

		const { username, email, password } = await req.json();
		const hashedPassword = password
			? await Bun.password.hash(password)
			: undefined;

		const result = await updateUserQuery.update(
			userId,
			username,
			email,
			hashedPassword,
		);
		return Response.json(result, { status: 200, headers: corsHeaders });
	} catch (e) {
		console.error("DB fetch error", e);
		return new Response("DB Error", { status: 500, headers: corsHeaders });
	}
};
