import * as v from "valibot";
import type { UserRow } from "../../utils/types";
import { db } from "../db/database";
import { CookieQuery } from "../repositories/cookieQuery";
import { LoginUserQuery } from "../repositories/loginUserQuery";
import { UserLoginSchema } from "../validators/authValidator";

export const loginCorsHeaders = {
	"Access-Control-Allow-Origin": "http://localhost:5173",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Allow-Credentials": "true",
	"Content-Type": "application/json",
} as const;

export const loginUser = async (req: Request) => {
	try {
		const body = await req.json();
		const result = v.safeParse(UserLoginSchema, body);

		if (!result.success) {
			return Response.json(
				{ error: "Validation failed", details: result.issues },
				{ status: 400, headers: loginCorsHeaders },
			);
		}

		const { email, password } = result.output;
		console.log(result.output);

		const userQuery = db.query(LoginUserQuery.getByEmail);
		const user = userQuery.get(email) as UserRow;

		if (!user) {
			return Response.json(
				{ error: "Invalid credentials" },
				{ status: 401, headers: loginCorsHeaders },
			);
		}
		const isMatch = await Bun.password.verify(password, user.password);

		if (!isMatch) {
			return Response.json(
				{ error: "Invalid credentials" },
				{ status: 401, headers: loginCorsHeaders },
			);
		}

		const sessionToken = crypto.randomUUID();

		const cookieQuery = db.query(CookieQuery.create);
		cookieQuery.run(sessionToken, user.id);

		const cookie = new Bun.Cookie("session", sessionToken, {
			httpOnly: true,
			secure: true,
			path: "/",
			sameSite: "strict",
			maxAge: 86400,
		});

		const headers = new Headers(loginCorsHeaders);
		headers.append("Set-Cookie", cookie.toString());

		return Response.json(
			{
				message: "Login successful",
				username: user.username,
				email: user.email,
				id: user.id,
			},
			{ status: 200, headers },
		);
	} catch (error) {
		console.error("Login error:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{ status: 500, headers: loginCorsHeaders },
		);
	}
};

