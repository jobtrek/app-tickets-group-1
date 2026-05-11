import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../data/schema";

const client = postgres(process.env.DATABASE_URL!, {
	max: 10,
	idle_timeout: 30,
	connect_timeout: 10,
	max_lifetime: 60 * 30,
});

export const db = drizzle(client, { schema });
