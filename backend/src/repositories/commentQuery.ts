import { asc, eq } from "drizzle-orm";
import { comments, users } from "../data/schema";
import { db } from "../db/database";

type CommentInsertValues = {
	idTicket: number;
	idUser: number;
	commentText: string;
};

const fullCommentSelect = {
	idComment: comments.idComment,
	commentText: comments.commentText,
	createdAt: comments.createdAt,
	authorId: comments.idUser,
	authorName: users.username,
	authorRole: users.role,
};

export const commentQuery = {
	getAll: (ticketId: number) =>
		db
			.select(fullCommentSelect)
			.from(comments)
			.innerJoin(users, eq(comments.idUser, users.idUser))
			.where(eq(comments.idTicket, ticketId))
			.orderBy(asc(comments.createdAt)),

	insert: async (values: CommentInsertValues) => {
		const [inserted] = await db
			.insert(comments)
			.values({
				idTicket: values.idTicket,
				idUser: values.idUser,
				userRole: "user",
				commentText: values.commentText,
			})
			.returning();

		if (!inserted)
			throw new Error("Comment insertion failed to return the new record.");
		return inserted;
	},

	getById: (idComment: number) =>
		db
			.select(fullCommentSelect)
			.from(comments)
			.innerJoin(users, eq(comments.idUser, users.idUser))
			.where(eq(comments.idComment, idComment))
			.then(([row]) => {
				if (!row)
					throw new Error(`Comment ${idComment} not found after insert.`);
				return row;
			}),
};
