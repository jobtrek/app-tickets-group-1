import { corsHeaders } from "backend/utils/headers";
import * as v from "valibot";
import { db } from "../db/database";
import { CookieQuery } from "../repositories/CookiQuery";
import { LoginUserQuerie } from "../repositories/LoginUserQuery";
import { UserLoginSchema } from "../validators/auth.validator";

export interface cookieType {
	user_id: number;
	session_token: string;
}
interface UserRow {
  id_user: number;
  email: string;
  password: string;
  username: string;
}


export const loginUser = async (req: Request) => {
	try {
		const body = await req.json();
		const result = v.safeParse(UserLoginSchema, body);

		if (!result.success) {
			return Response.json(
				{ error: "Validation failed", details: result.issues },
				{ status: 400, headers: corsHeaders },
			);
		}

		const { email, password } = result.output;
		console.log(result.output);

		const userQuery = db.query(LoginUserQuerie.getByEmail);
		const user = userQuery.get(email) as UserRow;

		if (!user) {
			return Response.json(
				{ error: "Invalid credentials" },
				{ status: 401, headers: corsHeaders },
			);
		}
		const isMatch = await Bun.password.verify(password, user.password);

		if (!isMatch) {
			return Response.json(
				{ error: "Invalid credentials" },
				{ status: 401, headers: corsHeaders },
			);
		}

		const sessionToken = crypto.randomUUID();

		const cookieQuery = db.query(CookieQuery.create);
		cookieQuery.run(sessionToken, user.id_user);

		const cookie = new Bun.Cookie("session", sessionToken, {
			httpOnly: true,
			secure: true,
			path: "/",
			sameSite: "strict",
			maxAge: 86400,
		});

		const headers = new Headers(corsHeaders);
		headers.append("Set-Cookie", cookie.toString());

		return Response.json(
			{ message: "Login successful" },
			{ status: 200, headers },
		);
	} catch (error) {
		console.error("Login error:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{ status: 500, headers: corsHeaders },
		);
	}
};
