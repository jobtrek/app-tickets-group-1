import { cookies } from "../data/schema";
import { db } from "../db/database";

export const CookieQuery = {
	create: (sessionToken: string, userId: number) =>
		db.insert(cookies).values({ sessionToken, idUser: userId }),
};
