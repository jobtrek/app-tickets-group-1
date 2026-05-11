import * as v from "valibot";

export const CommentPostSchema = v.object({
	commentText: v.pipe(
		v.string(),
		v.minLength(1, "Comment is required"),
		v.maxLength(1000, "Comment must be 1000 characters or less"),
	),
});

export type CommentPost = v.InferInput<typeof CommentPostSchema>;
