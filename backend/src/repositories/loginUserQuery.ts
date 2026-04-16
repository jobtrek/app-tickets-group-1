import { eq } from "drizzle-orm";
import { users } from "../data/schema";
import { db } from "../db/database";

export const LoginUserQuery = {
	getByEmail: (email: string) =>
		db.select().from(users).where(eq(users.email, email)),
};
