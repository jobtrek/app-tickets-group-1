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
					<button
						type="button"
						className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
						title="Modifier"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Modifier</title>
							<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
							<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
						</svg>
					</button>
					<button
						type="button"
						className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
						title="Supprimer"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="13"
							height="13"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						>
							<title>Supprimer</title>
							<polyline points="3 6 5 6 21 6" />
							<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
							<path d="M10 11v6" />
							<path d="M14 11v6" />
							<path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
						</svg>
					</button>
				</div>
			</div>

			<p className="text-base text-gray-600 leading-relaxed wrap-break-words">
				{comment.commentText}
			</p>
		</div>
	);
}
