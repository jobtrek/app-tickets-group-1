import type { Ticket } from "./types";

export const statusStyles: Record<Ticket["statusName"], string> = {
	Ouvert: "bg-indigo-100 text-indigo-600 border border-indigo-300",
	"En cours": "bg-yellow-100 text-yellow-600 border border-yellow-300",
	Fermé: "bg-red-100 text-red-600 border border-red-300",
	Résolu: "bg-emerald-100 text-emerald-600 border border-emerald-300",
};
