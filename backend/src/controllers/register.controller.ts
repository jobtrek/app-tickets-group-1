import { hashPassword } from "backend/utils/passwordHash.ts";
import * as v from "valibot";
import { corsHeaders } from "../../utils/headers";
import { db } from "../db/database.ts";
import { userQueries } from "../repositories/RegisterQuery.ts";
import { UserRegisterSchema } from "../validators/auth.validator";


export const postUser = async (req: Request) => {
	try {
		const body = await req.json();

		const validated = v.parse(UserRegisterSchema, body);

		const securedPassword = await hashPassword(validated.password);

		const insert = db.prepare(userQueries.insertUser);
		insert.run(validated.username, validated.email, 'user', securedPassword);

		return new Response("User created successfully", {
			status: 201,
			headers: corsHeaders,
		});
	} catch (e) {
		console.error("DB insertion error", e);
		return new Response("Error", { status: 400, headers: corsHeaders });
	}
};
