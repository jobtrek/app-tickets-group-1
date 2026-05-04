import { and, eq } from "drizzle-orm";
import { cookies, users } from "../data/schema";
import { db } from "../db/database";
import { corsHeaders } from "../utils/headers";

export type AuthUser = {
	idUser: number;
	username: string;
	email: string;
	role: string;
};

export type AuthedRequest<T extends string = string> = Bun.BunRequest<T> & {
	user: AuthUser;
};

type AuthenticatedHandler<T extends string = string> = (
	req: AuthedRequest<T>,
) => Response | Promise<Response | undefined> | undefined;

export const getSessionUser = async (
	req: Request,
): Promise<AuthUser | null> => {
	const cookieHeader = req.headers.get("cookie");
	const sessionToken = cookieHeader
		?.split(";")
		.find((c) => c.trim().startsWith("session="))
		?.split("=")[1]
		?.trim();

	if (!sessionToken) return null;

	const [session] = await db
		.select({
			idUser: users.idUser,
			username: users.username,
			email: users.email,
			role: users.role,
		})
		.from(cookies)
		.innerJoin(users, eq(cookies.idUser, users.idUser))
		.where(
			and(
				eq(cookies.sessionToken, sessionToken),
				//gt(cookies.expiresAt, new Date()),      THIS IS FOR WHEN WE ADD EXIRATION FOR SESSION IN DB DO NO TOUCH IT
			),
		);

	return session ?? null;
};

export const withAuth = <T extends string = string>(
	handler: AuthenticatedHandler<T>,
) => {
	return async (req: Bun.BunRequest<T>): Promise<Response> => {
		const user = await getSessionUser(req);

		if (!user) {
			return Response.json(
				{ error: "Unauthorized" },
				{ status: 401, headers: corsHeaders },
			);
		}

		(req as AuthedRequest<T>).user = user;
		const result = await handler(req as AuthedRequest<T>);
		return result ?? Response.json({ error: "No response" }, { status: 500 });
	};
};

export const withAdmin = <T extends string = string>(
	handler: AuthenticatedHandler<T>,
) => {
	return async (req: Bun.BunRequest<T>): Promise<Response> => {
		const user = await getSessionUser(req);

		if (!user) {
			return Response.json(
				{ error: "Unauthorized" },
				{ status: 401, headers: corsHeaders },
			);
		}

		if (user.role !== "admin") {
			return Response.json(
				{ error: "Forbidden" },
				{ status: 403, headers: corsHeaders },
			);
		}

		(req as AuthedRequest<T>).user = user;
		const result = await handler(req as AuthedRequest<T>);
		return result ?? Response.json({ error: "No response" }, { status: 500 });
	};
};
