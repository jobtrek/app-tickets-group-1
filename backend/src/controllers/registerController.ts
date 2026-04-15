import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { hashPassword } from "../../utils/passwordHash";
import type { UserResult } from "../../utils/types.ts";
import { db } from "../db/database.ts";
import { userQueries } from "../repositories/registerQuery.ts";
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

		const insert = db.prepare(userQueries.insertUser);
		const user = insert.get(
			validated.username,
			validated.email,
			securedPassword,
			"user",
		) as UserResult;

		return new Response(
			JSON.stringify({
				idUser: user.id_user,
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
