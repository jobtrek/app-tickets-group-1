import { loginCorsHeaders } from "backend/utils/headers";
import * as v from "valibot";
import { CookieQuery } from "../repositories/cookieQuery";
import { LoginUserQuery } from "../repositories/loginUserQuery";
import { isRateLimited } from "../utils/rateLimit";
import {
	errorResponse,
	jsonResponse,
	loginResponseError,
} from "../utils/responseFactory";
import { UserLoginSchema } from "../validators/authValidator";

const ONE_DAY = 60 * 60 * 24;

export const loginUser = async (req: Request) => {
	const ip = req.headers.get("x-forwarded-for") ?? "unknown";

	const body = await req.json().catch(() => null);
	if (!body) return loginResponseError("Invalid JSON", 400);

	const result = v.safeParse(UserLoginSchema, body);
	if (!result.success) return loginResponseError("Validation failed", 400);

	const { email, password } = result.output;

	if (isRateLimited(ip, 10) || isRateLimited(email, 5)) {
		return loginResponseError(
			"Too many login attempts. Please try again later.",
			429,
		);
	}

	try {
		const user = (await LoginUserQuery.getByEmail(email))[0] ?? null;
		// Always run verify regardless of whether the user exists to prevent
		// timing attacks that would reveal which emails are registered.
		const DUMMY_HASH =
			"$argon2id$v=19$m=65536,t=2,p=1$c29tZXNhbHRzb21lc2FsdA$aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
		const passwordMatches = await Bun.password
			.verify(password, user?.password ?? DUMMY_HASH)
			.catch(() => false);

		if (!user || !passwordMatches) {
			return loginResponseError("Invalid credentials", 401);
		}

		const sessionToken = Buffer.from(
			crypto.getRandomValues(new Uint8Array(32)),
		).toString("hex");

		await CookieQuery.create(sessionToken, user.idUser);

		const cookie = new Bun.Cookie("session", sessionToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			path: "/",
			sameSite: "lax",
			maxAge: ONE_DAY,
		});

		const headers = new Headers(loginCorsHeaders);
		headers.append("Set-Cookie", cookie.toString());

		return jsonResponse(
			{
				message: "Login successful",
				username: user.username,
				email: user.email,
				id: user.idUser,
				role: user.role,
			},
			200,
			headers,
		);
	} catch (error) {
		console.error("Login error:", error);
		return errorResponse("Internal Server Error", 500);
	}
};
