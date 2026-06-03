import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination";
import Select from "../components/Select";
import { useTicketStatusStore } from "../store/ticketStatusStore";
import { statusStyles } from "../utils/statusStyles";
import type { Ticket } from "../utils/types";

const colonnes = [
	"Nom du client",
	"Titre (Problème)",
	"Statut",
	"Date de création",
];

const sortOptions = [
	{ value: "desc", label: "Trier par: Date - les plus récents" },
	{ value: "asc", label: "Trier par: Date - les plus anciens" },
	{ value: "az", label: "Trier par: Ordre alphabétique" },
];

const statusOptions: Ticket["statusName"][] = [
	"Ouvert",
	"En cours",
	"Fermé",
	"Résolu",
];

interface TicketHistoryProps {
	tickets: Ticket[];
	totalPages: number;
	page: number;
	sort: string;
	status: string[];
	search: string;
}

export default function TicketHistory({
	tickets,
	totalPages,
	page,
	sort,
	status,
	search,
}: TicketHistoryProps) {
	const navigate = useNavigate({ from: "/ticket-history" });
	const statusByTicketId = useTicketStatusStore(
		(state) => state.statusByTicketId,
	);
	const [localSearch, setLocalSearch] = useState(search);

	useEffect(() => {
		setLocalSearch(search);
	}, [search]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (localSearch !== search) {
				navigate({
					search: (prev) => ({ ...prev, search: localSearch, page: 1 }),
				});
			}
		}, 300);
		return () => clearTimeout(timer);
	}, [localSearch, search, navigate]);

	const updateSearch = (updates: Record<string, unknown>) =>
		navigate({ search: (prev) => ({ ...prev, ...updates, page: 1 }) });

	const toggleFilter = (
		key: "status" | "level",
		value: string,
		current: string[],
	) => {
		const next = current.includes(value)
			? current.filter((v) => v !== value)
			: [...current, value];
		updateSearch({ [key]: next });
	};

	return (
		<div className="p-6 bg-white min-h-screen font-sans">
			<h1 className="text-2xl font-bold pb-4">Historique de ticket</h1>

			<div className="pb-4">
				<input
					type="text"
					placeholder="Rechercher par titre..."
					value={localSearch}
					onChange={(e) => setLocalSearch(e.currentTarget.value)}
					className="w-full md:max-w-xs px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 pb-8">
				<div className="w-full md:max-w-xs text-gray-500">
					<Select
						id="sort"
						value={sort}
						onChange={(e) => updateSearch({ sort: e.currentTarget.value })}
						options={sortOptions}
					/>
				</div>

				<div className="flex flex-col gap-1">
					<span className="text-xs text-gray-400 font-medium pb-1">Statut</span>
					<div className="flex flex-wrap gap-x-3 gap-y-3.5">
						{statusOptions.map((s) => (
							<label
								key={s}
								className="flex items-center gap-1.5 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={status.includes(s)}
									onChange={() => toggleFilter("status", s, status)}
								/>
								<span
									className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyles[s]}`}
								>
									{s}
								</span>
							</label>
						))}
					</div>
				</div>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full min-w-150 border-collapse">
					<thead>
						<tr className="border-b border-gray-200">
							{colonnes.map((col) => (
								<th
									key={col}
									className="text-left text-sm text-gray-400 font-normal pb-3 pr-6"
								>
									{col}
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{tickets.length === 0 ? (
							<tr>
								<td
									colSpan={colonnes.length}
									className="text-center py-16 text-gray-400"
								>
									<div className="flex flex-col items-center gap-4">
										<span className="text-sm">
											{search
												? "Aucun ticket ne correspond à votre recherche."
												: "Vous n'avez créé aucun ticket pour l'instant."}
										</span>
										<button
											type="button"
											onClick={() => navigate({ to: "/create-ticket" })}
											className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
										>
											Créer un ticket
										</button>
									</div>
								</td>
							</tr>
						) : (
							tickets.map((row) => (
								<tr
									onClick={() =>
										navigate({
											to: "/ticket/$id",
											params: { id: String(row.idTicket) },
										})
									}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											navigate({
												to: "/ticket/$id",
												params: { id: String(row.idTicket) },
											});
										}
									}}
									tabIndex={0}
									key={row.idTicket}
									className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
								>
									<td className="text-left text-sm font-semibold text-gray-800 py-5 pr-6">
										{row.username}
									</td>
									<td className="text-left text-sm text-gray-700 pr-6">
										{row.title}
									</td>
									<td className="text-left pr-6">
										{(() => {
											const liveStatus = (statusByTicketId[row.idTicket] ??
												row.statusName) as Ticket["statusName"];
											return (
												<span
													className={`inline-block text-xs px-3 py-1 rounded-md font-medium ${statusStyles[liveStatus]}`}
												>
													{liveStatus}
												</span>
											);
										})()}
									</td>
									<td className="text-left text-sm text-gray-600 pr-6 whitespace-nowrap">
										{new Date(row.createdAt).toLocaleString("fr-CH", {
											day: "numeric",
											month: "short",
											year: "numeric",
											hour: "numeric",
											minute: "numeric",
										})}
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>
			<Pagination
				page={page}
				totalPages={totalPages}
				onPageChange={(p) =>
					navigate({ search: (prev) => ({ ...prev, page: p }) })
				}
			/>
		</div>
	);
}
