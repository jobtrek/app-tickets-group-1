import { eq } from "drizzle-orm";
import { cookies, users } from "../data/schema";
import { db } from "../db/database";
export const CookieQuery = {
	create: (sessionToken: string, userId: number) =>
		db.insert(cookies).values({
			sessionToken,
			idUser: userId,
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		}),
	getByToken: (sessionToken: string) =>
		db
			.select({ idUser: cookies.idUser, role: users.role })
			.from(cookies)
			.innerJoin(users, eq(cookies.idUser, users.idUser))
			.where(eq(cookies.sessionToken, sessionToken))
			.limit(1)
			.then((r) => r[0] ?? null),
};
