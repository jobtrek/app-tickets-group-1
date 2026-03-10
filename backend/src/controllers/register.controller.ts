import { hashPassword } from "backend/utils/passwordHash.ts";
import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { db } from "../db/database.ts";
import { userQueries } from "../repositories/RegisterQuery.ts";
import { UserRegisterSchema } from "../validators/auth.validator";

interface UserResult {
	id_user: number;
	username: string;
	email: string;
}

export const postUser = async (req: Request) => {
	try {
		const body = await req.json();

		const validated = v.parse(UserRegisterSchema, body);

		const securedPassword = await hashPassword(validated.password);

		const insert = db.prepare(userQueries.insertUser);
		insert.run(validated.username, validated.email, securedPassword, "user");

		const result = insert.get(validated.username, validated.email, securedPassword, "user") as UserResult;

		return new Response(
			JSON.stringify({
				id_user: result.id_user,
				username: result.username,
				email: result.email,
				role: 'user'
			}),
			{ status: 201, headers: corsHeaders },
		);
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers: corsHeaders });
	}
};
