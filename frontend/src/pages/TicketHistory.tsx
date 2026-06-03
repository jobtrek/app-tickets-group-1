import { useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import Select from "../components/Select";
import { useTicketStatusStore } from "../store/ticketStatusStore";
import { useTicketStore } from "../store/ticketStore";
import { useUserStore } from "../store/userStore";
import { getFilteredUserTickets } from "../utils/getFilteredUserTickets";
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

export default function TicketHistory() {
	const navigate = useNavigate();
	const sort = useTicketStore((state) => state.sort);
	const setSort = useTicketStore((state) => state.setSort);
	const query = useTicketStore((state) => state.query);
	const setQuery = useTicketStore((state) => state.setQuery);

	const toggleStatusFilter = useTicketStore(
		(state) => state.toggleStatusFilter,
	);
	const statusFilter = useTicketStore((state) => state.statusFilter);
	const userId = useUserStore((state) => state.idUser);
	const filteredTickets = useTicketStore(
		useShallow(getFilteredUserTickets(userId)),
	);
	const hasAnyTickets = useTicketStore((state) =>
		state.tickets.some((t) => t.idUser === userId),
	);
	const hasActiveFilters = useTicketStore(
		(state) => !!state.query || state.statusFilter.length > 0,
	);
	const statusByTicketId = useTicketStatusStore(
		(state) => state.statusByTicketId,
	);

	return (
		<div className="p-6 bg-white min-h-screen font-sans">
			<h1 className="text-2xl font-bold pb-4">Historique des tickets</h1>

			<div className="flex gap-8 pb-8 items-end">
				<div className="flex flex-col gap-1">
					<span className="text-xs text-gray-400 font-medium pb-1">
						Rechercher
					</span>
					<input
						type="text"
						value={query}
						onChange={(e) => setQuery(e.currentTarget.value)}
						placeholder="Rechercher un ticket..."
						className="w-xs border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
					/>
				</div>
				<div className="flex flex-col gap-1 text-gray-500">
					<span className="text-xs text-gray-400 font-medium pb-1">Tri</span>
					<Select
						id="sort"
						value={sort}
						onChange={(e) => setSort(e.currentTarget.value)}
						options={sortOptions}
					/>
				</div>

				<div className="flex flex-col gap-1 pr-6">
					<span className="text-xs text-gray-400 font-medium pb-1">Statut</span>
					<div className="flex gap-3">
						{statusOptions.map((status) => (
							<label
								key={status}
								className="flex items-center gap-1.5 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={statusFilter.includes(status)}
									onChange={() => toggleStatusFilter(status)}
								/>
								<span
									className={`text-xs px-2 py-0.5 rounded-md font-medium ${statusStyles[status]}`}
								>
									{status}
								</span>
							</label>
						))}
					</div>
				</div>
			</div>

			<table className="w-full border-collapse">
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
					{filteredTickets.length === 0 ? (
						<tr>
							<td
								colSpan={colonnes.length}
								className="text-center py-16 text-gray-400"
							>
								{hasAnyTickets && hasActiveFilters ? (
									<div className="flex flex-col items-center gap-2">
										<span className="text-sm">
											Aucun ticket ne correspond à vos filtres.
										</span>
										<span className="text-xs text-gray-300">
											Essayez de modifier ou supprimer certains filtres.
										</span>
									</div>
								) : (
									<div className="flex flex-col items-center gap-4">
										<span className="text-sm">
											Vous n'avez créé aucun ticket pour l'instant.
										</span>
										<button
											type="button"
											onClick={() => navigate({ to: "/create-ticket" })}
											className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
										>
											Créer un ticket
										</button>
									</div>
								)}
							</td>
						</tr>
					) : (
						filteredTickets.map((row) => (
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
								<td className="text-left text-sm text-gray-600 pr-6">
									{new Date(row.createdAt).toLocaleString("fr-CH", {
										day: "numeric",
										month: "short",
										year: "numeric",
										hour: "numeric",
										minute: "numeric",
										second: "numeric",
									})}{" "}
								</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
