import { timeAgo } from "../utils/dateLogic";
import { getInitials } from "../utils/initialsLogic";
import type { Comment } from "../utils/types";

interface CommentCardProps {
	comment: Comment;
}

export default function CommentCard({ comment }: CommentCardProps) {
	const isAuthorAdmin = comment.authorRole?.toLowerCase() === "admin";

	return (
		<div
			className={`bg-white border rounded-xl px-5 py-4 mb-2 ${
				isAuthorAdmin
					? "border-gray-200 border-l-2 border-l-orange-300"
					: "border-gray-200"
			}`}
		>
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<div
						className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
							isAuthorAdmin
								? "bg-orange-100 text-orange-700"
								: "bg-gray-100 text-gray-500"
						}`}
					>
						{getInitials(comment.authorName)}
					</div>
					<span className="text-sm font-medium text-gray-700">
						{comment.authorName}
					</span>
					<span
						className={`text-xs px-2 py-0.5 rounded-full font-medium border ${
							isAuthorAdmin
								? "bg-orange-50 text-orange-700 border-orange-200"
								: "bg-blue-50 text-blue-600 border-blue-200"
						}`}
					>
						{isAuthorAdmin ? "admin" : "user"}
					</span>
				</div>

				<div className="flex items-center gap-2">
					<span
						className="text-xs text-gray-400"
						title={new Date(comment.createdAt).toLocaleString("fr-FR")}
					>
						{timeAgo(comment.createdAt)}
					</span>
				</div>
			</div>

			<p className="text-base text-gray-600 leading-relaxed wrap-break-words">
				{comment.commentText}
			</p>
		</div>
	);
}
