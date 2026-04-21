import { useNavigate } from "@tanstack/react-router";
import { useShallow } from "zustand/shallow";
import Select from "../components/Select";
import { useTicketStore } from "../store/ticketStore";
import { getFilteredTickets } from "../utils/sorting";
import { statusStyles } from "../utils/statusStyles";
import type { Ticket } from "../utils/types";

const urgenceStyles: Record<Ticket["level"], string> = {
	urgent: "text-red-500 font-semibold",
	haut: "text-orange-500 font-semibold",
	moyen: "text-gray-700",
	bas: "text-gray-400",
};

const colonnes = [
	"Nom du client",
	"Titre (Problème)",
	"Statut",
	"Support IT",
	"Date de création",
	"Niveau d'urgence",
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
const urgencyOptions: Ticket["level"][] = ["urgent", "haut", "moyen", "bas"];

export default function Dashboard() {
	const navigate = useNavigate();
	const sort = useTicketStore((state) => state.sort);
	const setSort = useTicketStore((state) => state.setSort);
	const toggleStatusFilter = useTicketStore(
		(state) => state.toggleStatusFilter,
	);
	const toggleUrgencyFilter = useTicketStore(
		(state) => state.toggleUrgencyFilter,
	);
	const statusFilter = useTicketStore((state) => state.statusFilter);
	const urgencyFilter = useTicketStore((state) => state.urgencyFilter);
	const filteredTickets = useTicketStore(useShallow(getFilteredTickets));

	return (
		<div className="p-6 bg-white min-h-screen font-sans">
			<h1 className="text-2xl font-bold pb-4">Dashboard</h1>

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

				<div className="flex flex-col gap-1">
					<span className="text-xs text-gray-400 font-medium pb-1">
						Urgence
					</span>
					<div className="flex gap-3">
						{urgencyOptions.map((urgency) => (
							<label
								key={urgency}
								className="flex items-center gap-1.5 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={urgencyFilter.includes(urgency)}
									onChange={() => toggleUrgencyFilter(urgency)}
								/>
								<span className={`text-xs py-0.5 ${urgenceStyles[urgency]}`}>
									{urgency}
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
							<td className="text-left text-sm pr-6">
								{row.supportUsername ? (
									<span className="text-gray-700">{row.supportUsername}</span>
								) : (
									<span className="italic text-gray-400">Non assigné</span>
								)}
							</td>
							<td className="text-left text-sm text-gray-600 pr-6">
								{new Date(row.createdAt).toLocaleDateString("fr-CH", {
									day: "numeric",
									month: "short",
									year: "numeric",
									hour: "numeric",
									minute: "numeric",
									second: "numeric",
								})}
							</td>
							<td
								className={`text-left text-sm pr-6 ${urgenceStyles[row.level]}`}
							>
								{row.level}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
