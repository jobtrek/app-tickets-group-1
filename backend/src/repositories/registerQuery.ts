import { users } from "../data/schema";
import { db } from "../db/database";

export const registerQuery = {
	InsertUser: (
		username: string,
		email: string,
		password: string,
		role: string,
	) => db.insert(users).values({ username, email, password, role }).returning(),
};
