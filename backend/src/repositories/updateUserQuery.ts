import { eq } from "drizzle-orm";
import { users } from "../data/schema";
import { db } from "../db/database";

export const updateUserQuery = {
	update: (userId: number, username: string, email: string, password: string) =>
		db
			.update(users)
			.set({
				username,
				email,
				password,
			})
			.where(eq(users.idUser, userId)),
};
