import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Pagination } from "../components/Pagination";
import Select from "../components/Select";
import { useTicketStatusStore } from "../store/ticketStatusStore";
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

interface DashboardProps {
	tickets: Ticket[];
	totalPages: number;
	page: number;
	sort: string;
	status: string[];
	level: string[];
	search: string;
}

export default function Dashboard({
	tickets,
	totalPages,
	page,
	sort,
	status,
	level,
	search,
}: DashboardProps) {
	const navigate = useNavigate({ from: "/dashboard" });
	const statusByTicketId = useTicketStatusStore(
		(state) => state.statusByTicketId,
	);
	const [localSearch, setLocalSearch] = useState(search);

	//remet l'input en phase avec l'URL quand on clique sur le bouton Précédent/Retour du navigateur
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
			<h1 className="text-2xl font-bold pb-4">Dashboard</h1>

			<div className="pb-4">
				<input
					type="text"
					placeholder="Rechercher par titre..."
					value={localSearch}
					onChange={(e) => setLocalSearch(e.currentTarget.value)}
					className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<div className="flex gap-8 pb-8">
				<div className="w-xs text-gray-500">
					<Select
						id="sort"
						value={sort}
						onChange={(e) => updateSearch({ sort: e.currentTarget.value })}
						options={sortOptions}
					/>
				</div>

				<div className="flex flex-col gap-1 pr-6">
					<span className="text-xs text-gray-400 font-medium pb-1">Statut</span>
					<div className="flex gap-3">
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

				<div className="flex flex-col gap-1">
					<span className="text-xs text-gray-400 font-medium pb-1">
						Urgence
					</span>
					<div className="flex gap-3">
						{urgencyOptions.map((u) => (
							<label
								key={u}
								className="flex items-center gap-1.5 cursor-pointer"
							>
								<input
									type="checkbox"
									checked={level.includes(u)}
									onChange={() => toggleFilter("level", u, level)}
								/>
								<span className={`text-xs py-0.5 ${urgenceStyles[u]}`}>
									{u}
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
					{tickets.map((row) => (
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
								className={`text-left text-sm pr-6 ${urgenceStyles[row.adminLevel ?? row.level]}`}
							>
								{row.adminLevel ?? row.level}
							</td>
						</tr>
					))}
				</tbody>
			</table>
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
