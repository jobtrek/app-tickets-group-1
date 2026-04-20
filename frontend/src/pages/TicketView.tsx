import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import CommentInput from "../components/CommentInput";
import CommentList from "../components/CommentList";
import TicketDetails from "../components/TicketDetails";
import TicketHeader from "../components/TicketHeader";
import { useUserStore } from "../store/userStore";
import {
	assignTicket,
	createComment,
	updateTicketStatus,
} from "../utils/ticketsApi";
import type { TicketViewProps } from "../utils/types";
import { useTicketComments } from "../utils/useTicketsComments";

export default function TicketView({
	title,
	description,
	date,
	level,
	image,
	username,
	statusName: initialStatusName,
	supportUsername: initialSupportUsername,
}: TicketViewProps) {
	const { id } = useParams({ from: "/_authenticated/ticket/$id" });
	const navigate = useNavigate();
	const ticketIdNumber = Number(id);

	const [commentInput, setCommentInput] = useState("");
	const [statusName, setStatusName] = useState(initialStatusName);
	const [supportUsername, setSupportUsername] = useState(
		initialSupportUsername,
	);
	const [pendingConfirmation, setPendingConfirmation] = useState(false);

	const userId = useUserStore((state) => state.idUser);
	const storeUsername = useUserStore((state) => state.username);
	const role = useUserStore((state) => state.role);
	const isAdmin = role === "admin";
	const isOwner = storeUsername === username;

	const isChatDisabled =
		statusName === "Résolu" || statusName === "Fermé"

	const { comments } = useTicketComments(ticketIdNumber);

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
			setSupportUsername(storeUsername);
			setStatusName("En cours");
		} catch (e) {
			console.error("Failed to assign ticket", e);
		}
	};

	const handleResolve = async () => {
		try {
			await updateTicketStatus(ticketIdNumber, 3);
			setStatusName("Résolu");
			setPendingConfirmation(true);
		} catch (e) {
			console.error("Failed to resolve ticket", e);
		}
	};

	const handleConfirmClose = async () => {
		try {
			await updateTicketStatus(ticketIdNumber, 4);
			setStatusName("Fermé");
			setPendingConfirmation(false);
		} catch (e) {
			console.error("Failed to close ticket", e);
		}
	};

	const handleRejectClose = async () => {
		try {
			await updateTicketStatus(ticketIdNumber, 2);
			setStatusName("En cours");
			setPendingConfirmation(false);
		} catch (e) {
			console.error("Failed to reopen ticket", e);
		}
	};

	const handleOwnerClose = async () => {
		try {
			await updateTicketStatus(ticketIdNumber, 4);
			setStatusName("Résolu");
		} catch (e) {
			console.error("Failed to close ticket", e);
		}
	};

	return (
		<div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-6 gap-8">
			<TicketHeader
				statusName={statusName}
				isAdmin={isAdmin}
				pendingConfirmation={pendingConfirmation}
				onBack={() => navigate({ to: "/" })}
				onResolve={handleResolve}
				onConfirmResolve={handleConfirmClose}
				onRejectResolve={handleRejectClose}
			/>
			<TicketDetails
				id={ticketIdNumber}
				title={title}
				date={date}
				description={description}
				level={level}
				image={image}
				username={username}
				statusName={statusName}
				supportUsername={supportUsername}
				isAdmin={isAdmin}
				isOwner={isOwner}
				onAssign={handleAssign}
				onOwnerClose={handleOwnerClose}
				ownerUsername={username}
			/>
			<div className="w-full max-w-5xl">
				<CommentList comments={comments} />

				{isOwner && !isAdmin && pendingConfirmation && (
					<div className="flex items-center gap-3 border border-yellow-200 bg-yellow-50 rounded-xl px-5 py-4 mb-4">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="text-yellow-500 shrink-0"
						>
							<title>Information</title>
							<circle cx="12" cy="12" r="10" />
							<line x1="12" y1="8" x2="12" y2="12" />
							<line x1="12" y1="16" x2="12.01" y2="16" />
						</svg>
						<p className="text-sm text-yellow-800 flex-1">
							Votre ticket a été marqué comme résolu. Est-ce bien le cas ?
						</p>
						<button
							type="button"
							onClick={handleConfirmClose}
							className="text-xs font-medium px-3 py-1.5 rounded-lg bg-green-100 text-green-700 border border-green-200 hover:bg-green-200 transition-colors"
						>
							Oui, clôturer
						</button>
						<button
							type="button"
							onClick={handleRejectClose}
							className="text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors"
						>
							Non, continuer
						</button>
					</div>
				)}

				{isChatDisabled ? (
					<div className="flex items-center gap-2 border border-dashed border-gray-200 rounded-xl px-5 py-4 text-sm text-gray-400">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<title>Chat désactivé</title>
							<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
							<path d="M7 11V7a5 5 0 0 1 10 0v4" />
						</svg>
						La messagerie est désactivée pour les tickets{" "}
						{statusName === "Résolu" ? "" : "résolus"}.
					</div>
				) : (
					<CommentInput
						value={commentInput}
						onChange={setCommentInput}
						onSubmit={handleSubmit}
					/>
				)}
			</div>
		</div>
	);
}