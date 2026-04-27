import { eq } from "drizzle-orm";
import { users } from "../data/schema";
import { db } from "../db/database";

export const updateUserQuery = {
	update: (
		userId: number,
		username?: string,
		email?: string,
		password?: string,
	) =>
		db
			.update(users)
			.set({
				username: username || undefined,
				email: email || undefined,
				password: password || undefined,
			})
			.where(eq(users.idUser, userId)).returning(),
};
