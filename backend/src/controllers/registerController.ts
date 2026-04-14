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

		const validated = v.parse(UserRegisterSchema, body);

		const securedPassword = await hashPassword(validated.password);

		const insert = db.prepare(userQueries.insertUser);
		const result = insert.get(
			validated.username,
			validated.email,
			securedPassword,
			"user",
		) as UserResult;

		return new Response(
			JSON.stringify({
				idUser: result.idUser,
				username: result.username,
				email: result.email,
				role: "user",
			}),
			{ status: 201, headers: corsHeaders },
		);
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers: corsHeaders });
	}
};
