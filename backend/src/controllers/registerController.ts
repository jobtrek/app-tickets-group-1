import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { hashPassword } from "../../utils/passwordHash";
import { users } from "../data/schema";
import { db } from "../db/database";
import { UserRegisterSchema } from "../validators/authValidator";
export const postUser = async (req: Request) => {
	try {
		const body = await req.json();

		const result = v.safeParse(UserRegisterSchema, body);

		if (!result.success) {
			return Response.json(
				{ errors: result.issues.map((i) => i.message) },
				{ status: 400, headers: corsHeaders },
			);
		}

		const validated = result.output;
		const securedPassword = await hashPassword(validated.password);

		const resp = await db
			.insert(users)
			.values({
				username: validated.username,
				email: validated.email,
				password: securedPassword,
				role: "user",
			})
			.returning()
			.onConflictDoNothing();

		if (!resp || resp.length === 0) {
			return new Response(JSON.stringify({ error: "Email already exists" }), {
				status: 400,
				headers: corsHeaders,
			});
		}

		const user = resp[0];
		if (!user) {
			return Response.json(
				{ error: "User creation failed" },
				{ status: 500, headers: corsHeaders },
			);
		}

		return new Response(
			JSON.stringify({
				idUser: user.idUser,
				username: user.username,
				email: user.email,
				role: "user",
			}),
			{ status: 201, headers: corsHeaders },
		);
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers: corsHeaders });
	}
};
