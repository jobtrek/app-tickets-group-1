import * as v from "valibot";

export const TicketLevelEnum = v.picklist(
	["bas", "moyen", "haut", "urgent"],
	"Le niveau doit être : Bas, Moyen, Haut ou Urgent",
);

export const TicketPostSchema = v.object({
	title: v.pipe(
		v.string(),
		v.minLength(1, "Title is required"),
		v.maxLength(100, "Title must be 100 characters or less"),
	),
	description: v.pipe(v.string(), v.minLength(1, "Description is required")),
	image: v.optional(v.nullable(v.unknown())),
	level: v.optional(TicketLevelEnum),
	idStatus: v.optional(v.pipe(v.number(), v.integer(), v.minValue(1))),
	idUser: v.pipe(
		v.number(),
		v.integer(),
		v.minValue(1, "A valid user ID is required"),
	),
});

export type TicketPost = v.InferInput<typeof TicketPostSchema>;
