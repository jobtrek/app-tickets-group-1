import { eq } from "drizzle-orm";
import { status } from "../data/schema";
import { db } from "./database";

const statusSeeds = [
	{ idStatus: 1, statusName: "Ouvert" },
	{ idStatus: 2, statusName: "En cours" },
	{ idStatus: 3, statusName: "Résolu" },
	{ idStatus: 4, statusName: "Fermé" },
];

for (const { idStatus, statusName } of statusSeeds) {
	await db
		.update(status)
		.set({ statusName })
		.where(eq(status.idStatus, idStatus));
}

console.log("Status seeded.");
process.exit(0);
