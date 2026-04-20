import { useState } from "react";
import { getInitials } from "../utils/initialsLogic";
import { statusStyles } from "../utils/statusStyles";
import type { Ticket } from "../utils/types";
import { urgencyColor } from "../utils/types";

interface TicketDetailsProps {
	id: number;
	title: string;
	date: string;
	description: string;
	level: Ticket["level"];
	image: string | null;
	username: string;
	statusName: Ticket["statusName"];
	supportUsername: string | null;
	isAdmin: boolean;
	isOwner: boolean;
	onAssign: () => void;
	onOwnerClose: () => void;
	ownerUsername: string;
}

export default function TicketDetails({
	id,
	title,
	date,
	description,
	level,
	image,
	username,
	statusName,
	supportUsername,
	isAdmin,
	isOwner,
	onAssign,
	onOwnerClose,
}: TicketDetailsProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			action();
		} else if (e.key === "Escape") {
			setIsModalOpen(false);
		}
	};

	const isClosed = statusName === "Résolu";

	return (
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
				Créé le{" "}
				{new Date(date).toLocaleDateString("fr-CH", {
					day: "numeric",
					month: "long",
					year: "numeric",
				})}{" "}
				· #{id}
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
			{image ? (
				<div className="mb-6">
					<img
						src={`${import.meta.env.VITE_UPLOADS_URL}/${image}`}
						alt="Pièce jointe (cliquer pour agrandir)"
						className="rounded-lg border border-gray-200 max-h-64 object-contain cursor-zoom-in hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-400"
						onClick={() => setIsModalOpen(true)}
						onKeyDown={(e) => handleKeyDown(e, () => setIsModalOpen(true))}
					/>

					{isModalOpen && (
						<div
							className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 cursor-zoom-out"
							role="dialog"
							aria-modal="true"
							onClick={() => setIsModalOpen(false)}
							onKeyDown={(e) => handleKeyDown(e, () => setIsModalOpen(false))}
						>
							<div className="relative max-w-7xl max-h-[90vh]">
								<img
									src={`${import.meta.env.VITE_UPLOADS_URL}/${image}`}
									alt="Plein écran"
									className="rounded-lg object-contain max-h-[90vh] w-full cursor-default shadow-2xl"
									onClick={(e) => e.stopPropagation()}
									onKeyDown={(e) => {
										e.stopPropagation();
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
										}
									}}
								/>
							</div>
						</div>
					)}
				</div>
			) : (
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
						<title>Pièces jointes</title>
						<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
					</svg>
					Aucune pièce jointe
				</div>
			)}

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
							type="button"
							onClick={onAssign}
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

					{isOwner && !supportUsername && !isClosed && (
						<button
							type="button"
							onClick={onOwnerClose}
							className="inline-flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors mt-2"
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
								<title>Fermer le ticket</title>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
							Fermer le ticket
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
