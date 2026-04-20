import * as v from "valibot";

export const CommentPostSchema = v.object({
	commentText: v.pipe(
		v.string(),
		v.minLength(1, "Comment is required"),
		v.maxLength(1000, "Comment must be 1000 characters or less"),
	),
	idUser: v.pipe(
		v.number(),
		v.integer(),
		v.minValue(1, "A valid user ID is required"),
	),
	idTicket: v.pipe(
		v.number(),
		v.integer(),
		v.minValue(1, "A valid ticket ID is required"),
	),
});

export type CommentPost = v.InferInput<typeof CommentPostSchema>;
