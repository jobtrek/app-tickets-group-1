import { eq } from "drizzle-orm";
import { cookies } from "../data/schema";
import { db } from "../db/database";

export const loginCorsHeaders = {
	"Access-Control-Allow-Origin": "http://localhost:5173",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
	"Access-Control-Allow-Credentials": "true",
	"Content-Type": "application/json",
} as const;

export const logoutUser = async (req: Request) => {
	try {
		const cookieHeader = req.headers.get("cookie");
		const sessionToken = cookieHeader
			?.split(";")
			.find((c) => c.trim().startsWith("session="))
			?.split("=")[1];

		if (!sessionToken) {
			return Response.json(
				{ error: "No session found" },
				{ status: 401, headers: loginCorsHeaders },
			);
		}

		// Delete session from DB
		await db.delete(cookies).where(eq(cookies.sessionToken, sessionToken));

		const expiredCookie = new Bun.Cookie("session", "", {
			httpOnly: true,
			secure: true,
			path: "/",
			sameSite: "strict",
			maxAge: 0,
		});

		const headers = new Headers(loginCorsHeaders);
		headers.append("Set-Cookie", expiredCookie.toString());

		return Response.json(
			{ message: "Logout successful" },
			{ status: 200, headers },
		);
	} catch (error) {
		console.error("Logout error:", error);
		return Response.json(
			{ error: "Internal Server Error" },
			{ status: 500, headers: loginCorsHeaders },
		);
	}
};
