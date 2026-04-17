import { useState } from "react";
import User from "../components/User";
import { statusStyles } from "../utils/statusStyles";
import type { Ticket } from "../utils/types";

interface TicketViewProps {
	id: number;
	title: string;
	date: string;
	description: string;
	level: string;
	image?: string | null;
	username: string;
	statusName: Ticket["statusName"];
}

export default function TicketView({
	id,
	title,
	description,
	date,
	level,
	image,
	username,
	statusName,
}: TicketViewProps) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const levelColors: Record<string, string> = {
		moyen: "text-gray-700",
		bas: "text-gray-400",
		haut: "text-orange-600",
		urgent: "text-red-600",
	};

	const currentColor = levelColors[level] || "text-gray-400";

	const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			action();
		} else if (e.key === "Escape") {
			setIsModalOpen(false);
		}
	};

	return (
		<div className="min-h-screen w-full flex flex-col items-center py-24 px-4">
			<div className="w-full max-w-6xl border-2 rounded-xl p-10 border-gray-400">
				<div className="flex justify-between">
					<h1 className="text-3xl">{title}</h1>
					<span
						className={`p-4 ${statusStyles[statusName]} border-2 rounded-4xl w-52 text-center text-xl`}
					>
						{statusName}
					</span>
				</div>

				<p className="text-gray-400 text-lg pb-10">Crée le {date}</p>
				<hr className="border-t-2 border-gray-200 pb-5" />

				<div className="pb-10">
					<User username={username} />
				</div>

				<h2 className="text-gray-400 text-xl pb-5">Description</h2>
				<p className="pb-10">{description}</p>

				<h2 className="text-gray-400 text-xl pb-10">Pièces jointes</h2>

				{image ? (
					<div className="pb-10">
						<img
							src={`http://localhost:3001/uploads/${image}`}
							alt="Pièce jointe (cliquer pour agrandir)"
							tabIndex={0}
							className="w-100 h-64 object-cover rounded-lg border border-gray-300 shadow-sm cursor-zoom-in hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
								tabIndex={-1}
							>
								<div className="relative max-w-7xl max-h-[90vh]">
									<img
										src={`http://localhost:3001/uploads/${image}`}
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
					<p className=" pb-10 text-gray-400 italic">Aucune pièce jointe.</p>
				)}

				<div className="w-full bg-gray-200 p-5 pb-10 rounded-xl flex gap-120 items-center">
					<div className="flex flex-col gap-2 pl-4">
						<p className="text-xs font-semibold text-gray-500">
							NIVEAU D'URGENCE
						</p>
						<p className={`font-bold text-xl uppercase ${currentColor}`}>
							{level}
						</p>
					</div>
					<div className="flex flex-col gap-2 pr-4 ">
						<p className="text-xs font-semibold text-gray-500">ASSIGNÉ À</p>
						<p className="font-bold text-xl">John Doe</p>
					</div>
				</div>
			</div>
		</div>
	);
}
