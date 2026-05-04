import { eq } from "drizzle-orm";
import { users } from "../data/schema";
import { db } from "../db/database";

export const userQueries = {
	getSupportById: (idSupport: number) =>
		db
			.select({ username: users.username, role: users.role })
			.from(users)
			.where(eq(users.idUser, idSupport))
			.then(([user]) => user ?? null),

	getByEmail: (email: string) =>
		db
			.select()
			.from(users)
			.where(eq(users.email, email))
			.then(([user]) => user ?? null),

	getById: (idUser: number) =>
		db
			.select()
			.from(users)
			.where(eq(users.idUser, idUser))
			.then(([user]) => user ?? null),
};
