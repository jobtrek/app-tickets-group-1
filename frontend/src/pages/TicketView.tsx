import { useNavigate, useParams, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";
import { statusStyles } from "../utils/statusStyles";
import { assignTicket, createComment, getComments } from "../utils/ticketsApi";
import { updateTicketStatus } from "../utils/ticketsApi";
import type { Ticket } from "../utils/types";

interface TicketViewProps {
	id: number;
	title: string;
	date: string;
	description: string;
	level: Ticket["level"];
	username: string;
	statusName: Ticket["statusName"];
	supportUsername: string | null;
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
		{ label: "an", seconds: 31536000 },
		{ label: "mois", seconds: 2592000 },
		{ label: "semaine", seconds: 604800 },
		{ label: "jour", seconds: 86400 },
		{ label: "heure", seconds: 3600 },
		{ label: "minute", seconds: 60 },
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
	const commentDay = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);

	if (commentDay.getTime() === today.getTime()) return "Aujourd'hui";
	if (commentDay.getTime() === yesterday.getTime()) return "Hier";
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};

const getInitials = (name: string) =>
	name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

const urgencyColor: Record<Ticket["level"], string> = {
	urgent: "text-red-500 font-semibold",
	haut: "text-orange-500 font-semibold",
	moyen: "text-gray-700",
	bas: "text-gray-400",
};

export default function TicketView({
	title,
	description,
	date,
	level,
	username,
	statusName,
	supportUsername,
}: TicketViewProps) {
	const { id } = useParams({ from: "/_authenticated/ticket/$id" });
	const navigate = useNavigate();
	const ticketIdNumber = Number(id);
	const [commentInput, setCommentInput] = useState("");
	const [comments, setComments] = useState<Comment[]>([]);
	const [, setTick] = useState(0);
	const userId = useUserStore((state) => state.idUser);
	const role = useUserStore((state) => state.role);
	const isAdmin = role === "admin";
	const router = useRouter();

	useEffect(() => {
		getComments(ticketIdNumber).then(setComments);

		const wsBaseUrl = import.meta.env.VITE_API_URL.replace(/^http/, "ws");
		const ws = new WebSocket(`${wsBaseUrl}/${ticketIdNumber}/ws`);
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
		try {
			await createComment(commentInput, userId, ticketIdNumber);
			setCommentInput("");
		} catch (e) {
			console.error("Failed to post comment", e);
		}
	};

	const handleAssign = async () => {
		try {
			await assignTicket(ticketIdNumber, userId);
			await updateTicketStatus(ticketIdNumber, 2);
			router.invalidate();
		} catch (e) {
			console.error("Failed to assign ticket", e);
		}
	};
	const handleResolve = async () => {
		try {
			await updateTicketStatus(ticketIdNumber, 3);
			router.invalidate();
		} catch (e) {
			console.error("Failed to resolve ticket", e);
		}
	}

	return (
		<div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-6 gap-8">
			<div className="w-full max-w-5xl flex items-center justify-between">
				<button
					type="button"
					onClick={() => navigate({ to: "/" })}
					className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm hover:bg-gray-50 active:scale-95 transition-all"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
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

				<button
					type="button"
					onClick={handleResolve}
					disabled={statusName === "Résolu"}
					className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-300 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-green-50 disabled:active:scale-100"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
					{statusName === "Résolu" ? "Résolu" : "Marquer comme résolu"}
				</button>
			</div>

			<div className="w-full max-w-5xl bg-white border border-gray-200 rounded-xl p-10">
				<div className="flex items-start justify-between gap-4 mb-1">
					<h1 className="text-2xl font-medium text-gray-900">{title}</h1>
					<span
						className={`shrink-0 text-xs font-medium px-3 py-1 rounded-full border ${statusStyles[statusName]}`}
					>
						{statusName}
					</span>
				</div>
				<p className="text-sm text-gray-400 mb-6">
					Créé le {date} · #{ticketIdNumber}
				</p>

				<hr className="border-gray-100 mb-5" />

				<div className="flex items-center gap-3 mb-6">
					<div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 shrink-0">
						{getInitials(username)}
					</div>
					<div>
						<p className="text-base font-medium text-gray-800">{username}</p>
						<p className="text-xs text-gray-400">Demandeur</p>
					</div>
				</div>

				<p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
					Description
				</p>
				<p className="text-base text-gray-600 leading-relaxed mb-6">
					{description}
				</p>

				<p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
					Pièces jointes
				</p>
				<div className="border border-dashed border-gray-200 rounded-lg px-4 py-3 flex items-center gap-2 text-sm text-gray-400 mb-6">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.5"
					>
						<title>Prendre en charge</title>
						<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
					</svg>
					Aucune pièce jointe
				</div>

				<hr className="border-gray-100 mb-5" />

				<div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-lg p-5">
					<div>
						<p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
							Niveau d'urgence
						</p>
						<p
							className={`text-base font-medium ${urgencyColor[level] ?? "text-gray-700"}`}
						>
							{level}
						</p>
					</div>
					<div>
						<p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-1">
							Assigné à
						</p>
						{supportUsername ? (
							<p className="text-sm text-gray-700 font-medium mb-2">
								{supportUsername}
							</p>
						) : (
							<p className="text-sm text-gray-400 italic mb-2">Non assigné</p>
						)}
						{isAdmin && !supportUsername && (
							<button
								type="submit"
								onClick={handleAssign}
								className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<title>Prendre en charge</title>
									<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
									<circle cx="9" cy="7" r="4" />
									<line x1="19" y1="8" x2="19" y2="14" />
									<line x1="22" y1="11" x2="16" y2="11" />
								</svg>
								Prendre en charge
							</button>
						)}
					</div>
				</div>
			</div>

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
							const isAdmin = comment.authorRole === "admin";
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

									<div
										className={`bg-white border rounded-xl px-5 py-4 mb-2 ${
											isAdmin
												? "border-l-2 border-l-orange-300 border-gray-100"
												: "border-gray-100"
										}`}
									>
										<div className="flex items-center justify-between mb-2">
											<div className="flex items-center gap-2">
												<div
													className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
														isAdmin
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
														isAdmin
															? "bg-orange-50 text-orange-700 border-orange-200"
															: "bg-blue-50 text-blue-600 border-blue-200"
													}`}
												>
													{isAdmin ? "admin" : "user"}
												</span>
											</div>

											<div className="flex items-center gap-2">
												<span
													className="text-xs text-gray-400"
													title={new Date(comment.createdAt).toLocaleString(
														"fr-FR",
													)}
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
														<title>Prendre en charge</title>
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
														<title>Prendre en charge</title>
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
								</div>
							);
						})
					)}
				</div>

				<div className="mt-4">
					<textarea
						className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-white resize-none focus:outline-none focus:border-blue-300 transition-colors leading-relaxed"
						rows={5}
						placeholder="Ajouter un commentaire..."
						value={commentInput}
						onChange={(e) => setCommentInput(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit();
							}
						}}
					/>
					<div className="flex items-center justify-between mt-2">
						<span className="text-xs text-gray-400">
							Entrée pour envoyer · Maj+Entrée pour un saut de ligne
						</span>
						<button
							type="submit"
							onClick={handleSubmit}
							disabled={!commentInput.trim()}
							className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
						>
							Envoyer
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
