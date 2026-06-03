import { cookies } from "../data/schema";
import { db } from "../db/database";
export const CookieQuery = {
	create: (sessionToken: string, userId: number) =>
		db.insert(cookies).values({
			sessionToken,
			idUser: userId,
			expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
		}),
};
