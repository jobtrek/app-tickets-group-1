import { loginCorsHeaders } from "backend/utils/headers";
import { eq } from "drizzle-orm";
import { cookies } from "../data/schema";
import { db } from "../db/database";

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

		await db.delete(cookies).where(eq(cookies.sessionToken, sessionToken));

		const expiredCookie = new Bun.Cookie("session", "", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			sameSite: "lax",
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
