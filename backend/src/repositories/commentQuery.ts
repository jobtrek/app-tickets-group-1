import { asc, eq } from "drizzle-orm";
import { comments, users } from "../data/schema";
import { db } from "../db/database";

export const commentQuery = {
	getAll: (ticketId: number) =>
		db
			.select({
				idComment: comments.idComment,
				commentText: comments.commentText,
				createdAt: comments.createdAt,
				authorId: comments.idUser,
				authorName: users.username,
				authorRole: users.role,
			})
			.from(comments)
			.innerJoin(users, eq(comments.idUser, users.idUser))
			.where(eq(comments.idTicket, ticketId))
			.orderBy(asc(comments.createdAt)),
};
