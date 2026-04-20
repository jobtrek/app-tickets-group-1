import { useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import Select from "../components/Select";
import { useTicketStore } from "../store/ticketStore";
import { getFilteredTickets } from "../utils/sorting";
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
	const toggleStatusFilter = useTicketStore(
		(state) => state.toggleStatusFilter,
	);
	const statusFilter = useTicketStore((state) => state.statusFilter);
	const filteredTickets = useTicketStore(useShallow(getFilteredTickets));

	return (
		<div className="p-6 bg-white min-h-screen font-sans">
			<h1 className="text-2xl font-bold pb-4">Historique des tickets</h1>

			<div className="flex gap-8 pb-8">
				<div className="w-xs text-gray-500 ">
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
					{filteredTickets.map((row) => (
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
								<span
									className={`inline-block text-xs px-3 py-1 rounded-md font-medium ${statusStyles[row.statusName]}`}
								>
									{row.statusName}
								</span>
							</td>
							<td className="text-left text-sm text-gray-600 pr-6">
								{row.createdAt}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
