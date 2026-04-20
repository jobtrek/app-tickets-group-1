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
	const [supportUsername, setSupportUsername] = useState(initialSupportUsername);

	const userId = useUserStore((state) => state.idUser);
	const storeUsername = useUserStore((state) => state.username);
	const role = useUserStore((state) => state.role);
	const isAdmin = role === "admin";

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
		} catch (e) {
			console.error("Failed to resolve ticket", e);
		}
	};

	return (
		<div className="min-h-screen w-full bg-gray-50 flex flex-col items-center py-12 px-6 gap-8">
			<TicketHeader
				statusName={statusName}
				isAdmin={isAdmin}
				onBack={() => navigate({ to: "/" })}
				onResolve={handleResolve}
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
				onAssign={handleAssign}
			/>
			<div className="w-full max-w-5xl">
				<CommentList comments={comments} />
				<CommentInput
					value={commentInput}
					onChange={setCommentInput}
					onSubmit={handleSubmit}
				/>
			</div>
		</div>
	);
}
