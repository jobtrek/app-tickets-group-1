import { getDateLabel } from "../utils/dateLogic";
import type { Comment } from "../utils/types";
import CommentCard from "./CommentCard";

interface CommentListProps {
	comments: Comment[];
}

export default function CommentList({ comments }: CommentListProps) {
	return (
		<div className="w-full max-w-5xl">
			<div className="flex items-center justify-between mb-4">
				<h2 className="text-lg font-medium text-gray-800">Commentaires</h2>
				<span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
					{comments.length} commentaire{comments.length !== 1 ? "s" : ""}
				</span>
			</div>

			<div className="flex flex-col">
				{comments.length === 0 ? (
					<p className="text-sm text-gray-400 italic">
						Aucun commentaire pour le moment.
					</p>
				) : (
					comments.map((comment, index) => {
						const dateLabel = getDateLabel(comment.createdAt);
						const prevComment = comments[index - 1];
						const prevDateLabel = prevComment
							? getDateLabel(prevComment.createdAt)
							: null;
						const showDateSeparator = dateLabel !== prevDateLabel;

						return (
							<div key={comment.idComment}>
								{showDateSeparator && (
									<div className="flex items-center gap-3 my-4">
										<div className="flex-1 border-t border-gray-100" />
										<span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
											{dateLabel}
										</span>
										<div className="flex-1 border-t border-gray-100" />
									</div>
								)}
								<CommentCard comment={comment} />
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}
