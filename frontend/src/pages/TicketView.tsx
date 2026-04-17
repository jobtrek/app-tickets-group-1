"use client";

import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import User from "../components/User";
import { useUserStore } from "../store/userStore";
import { createComment, getComments } from "../utils/ticketsApi";

interface TicketViewProps {
	id: number;
	title: string;
	date: string;
	description: string;
	level: string;
}

interface Comment {
	idComment: number;
	authorId: number;
	authorName: string;
	commentText: string;
	createdAt: string;
	authorRole: string;
}

function timeAgo(dateStr: string): string {
	const now = new Date();
	const past = new Date(dateStr);
	const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

	const intervals: { label: string; seconds: number }[] = [
		{ label: "an",     seconds: 31536000 },
		{ label: "mois",   seconds: 2592000  },
		{ label: "semaine",seconds: 604800   },
		{ label: "jour",   seconds: 86400    },
		{ label: "heure",  seconds: 3600     },
		{ label: "minute", seconds: 60       },
	];

	for (const interval of intervals) {
		const count = Math.floor(seconds / interval.seconds);
		if (count >= 1) {
			const plural = count > 1 && interval.label !== "mois" ? "s" : "";
			return `il y a ${count} ${interval.label}${plural}`;
		}
	}

	return "à l'instant";
}

const getDateLabel = (dateStr: string): string => {
	const date = new Date(dateStr);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const commentDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());

	if (commentDay.getTime() === today.getTime()) return "Aujourd'hui";
	if (commentDay.getTime() === yesterday.getTime()) return "Hier";
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

export default function TicketView({
	id: _id,
	title,
	description,
	date,
	level,
}: TicketViewProps) {
	const { id } = useParams({ from: "/_authenticated/ticket/$id" });
	const navigate = useNavigate();

	const ticketIdNumber = Number(id);

	const [commentInput, setCommentInput] = useState("");
	const [comments, setComments] = useState<Comment[]>([]);
	const [, setTick] = useState(0); 
	const userId = useUserStore((state) => state.idUser);

	useEffect(() => {
		getComments(ticketIdNumber).then(setComments);

		const ws = new WebSocket(
			`ws://localhost:3001/api/tickets/${ticketIdNumber}/ws`,
		);
		ws.onmessage = (event) => {
			const comment = JSON.parse(event.data);
			setComments((prev) => [...prev, comment]);
		};
		return () => ws.close();
	}, [ticketIdNumber]);

	useEffect(() => {
		const interval = setInterval(() => setTick((t) => t + 1), 60_000);
		return () => clearInterval(interval);
	}, []);

	const handleSubmit = async () => {
		if (!commentInput.trim()) return;
		setCommentInput("");
		await createComment(commentInput, userId, ticketIdNumber);
	};

	return (
		<div className="min-h-screen w-full flex flex-col items-center py-24 px-4 gap-8">
			<div className="w-full max-w-6xl">
				<button
					type="button"
					onClick={() => navigate({ to: "/" })}
					className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-600 text-sm font-medium active:scale-95 transition-all duration-150"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<path d="M19 12H5M12 5l-7 7 7 7" />
					</svg>
					Retour
				</button>
			</div>
			<div className="w-full max-w-6xl border-2 rounded-xl p-10 border-gray-400">
				<div className="flex justify-between">
					<h1 className="text-3xl">{title}</h1>
					<span className="p-4 border-indigo-300 bg-indigo-100 text-indigo-600 border-2 rounded-4xl w-52 text-center text-xl">
						Ouvert
					</span>
				</div>

				<p className="text-gray-400 text-lg pb-10">Crée le {date}</p>
				<hr className="border-t-2 border-gray-200 pb-10" />

				<div className="pb-20">
					<User />
				</div>

				<h2 className="text-gray-400 text-xl pb-5">Description</h2>
				<p className="pb-10">{description}</p>

				<h2 className="text-gray-400 text-xl pb-20">Pièces jointes</h2>

				<div className="w-full bg-gray-200 p-5 pb-20 rounded-xl flex gap-120">
					<div className="flex flex-col gap-2 pl-4">
						<p className="text-xs font-semibold text-gray-500">NIVEAU D'URGENCE</p>
						<p className="font-bold text-xl">{level}</p>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-xs font-semibold text-gray-500">ASSIGNÉ À</p>
						<p className="font-bold text-xl">John Doe</p>
					</div>
				</div>
			</div>

			<div className="w-full max-w-6xl">
				<h2 className="text-gray-400 text-xl pb-5">Commentaires</h2>

				<div className="flex flex-col gap-4 mb-8">
					{comments.length === 0 ? (
						<p className="text-gray-400 text-sm italic">
							Aucun commentaire pour le moment.
						</p>
					) : (
						comments.map((comment, index) => {
							const isAdmin = comment.authorRole === "admin";
							const dateLabel = getDateLabel(comment.createdAt);
							
							if(!comments[index - 1]){
								console.error('Previous comment is undefined for comment ID:', comment.idComment);
							}
							const prevDateLabel = index > 0 ? getDateLabel(comments[index - 1].createdAt) : null;
							const showDateSeparator = dateLabel !== prevDateLabel;

							return (
								<div key={comment.idComment}>
									{showDateSeparator && (
										<div className="flex items-center gap-3 my-4">
											<div className="flex-1 border-t border-gray-300" />
											<span className="text-xs font-semibold text-gray-400 uppercase">
												{dateLabel}
											</span>
											<div className="flex-1 border-t border-gray-300" />
										</div>
									)}
									<div className="border border-gray-200 rounded-xl p-5 bg-gray-50">
										<div className="flex justify-between items-center mb-2">
											{isAdmin ? (
												<>
													<span className="text-xs text-gray-400" title={new Date(comment.createdAt).toLocaleString("fr-FR")}>
														{timeAgo(comment.createdAt)}
													</span>
													<div className="flex items-center gap-2">
														<span className="font-semibold text-gray-700">{comment.authorName}</span>
														<span className="px-2 py-0.5 bg-red-100 text-red-600 border border-red-300 rounded-full text-xs font-semibold">
															{comment.authorRole}
														</span>
													</div>
												</>
											) : (
												<>
													<div className="flex items-center gap-2">
														<span className="font-semibold text-gray-700">{comment.authorName}</span>
														<span className="px-2 py-0.5 bg-blue-100 text-blue-600 border border-blue-300 rounded-full text-xs font-semibold">
															user
														</span>
													</div>
													<span className="text-xs text-gray-400" title={new Date(comment.createdAt).toLocaleString("fr-FR")}>
														{timeAgo(comment.createdAt)}
													</span>
												</>
											)}
										</div>
										<p className={`text-gray-700 wrap-break-word overflow-hidden ${isAdmin ? "text-right" : ""}`}>
											{comment.commentText.length > 200 ? (
												<>
													{comment.commentText.slice(0, 200)}
													<br />
													{comment.commentText.slice(200)}
												</>
											) : (
												comment.commentText
											)}
										</p>
									</div>
								</div>
							);
						})
					)}
				</div>

				<div className="flex flex-col gap-3">
					<textarea
						className="w-full border-2 border-gray-300 rounded-xl p-4 text-gray-700 resize-none focus:outline-none focus:border-indigo-400 transition-colors"
						rows={4}
						placeholder="Ajouter un commentaire..."
						value={commentInput}
						onChange={(e) => setCommentInput(e.target.value)}
					/>
					<div className="flex justify-end">
						<button
							type="submit"
							onClick={handleSubmit}
							disabled={!commentInput.trim()}
							className="px-6 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							Envoyer
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}