import { useNavigate } from "@tanstack/react-router";
import type { Ticket } from "frontend/routes/dashboard";
import Select from "../components/Select";

const statutStyles: Record<Ticket["id_status"], string> = {
	Ouvert: "bg-indigo-100 text-indigo-600 border border-indigo-300",
	"En cours": "bg-yellow-100 text-yellow-600 border border-yellow-300",
	Fermé: "bg-red-100 text-red-600 border border-red-300",
	Résolu: "bg-emerald-100 text-emerald-600 border border-emerald-300",
};

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
	{ value: "date", label: "Trier par: Date" },
	{ value: "status", label: "Trier par: Status" },
	{ value: "urgency", label: "Trier par: Niveau d'urgence" },
];

interface DashboardProps {
	data: Ticket[];
}

export default function Dashboard({ data }: DashboardProps) {
	const navigate = useNavigate();

	return (
		<div className="p-6 bg-white min-h-screen font-sans">
			<h1 className="text-2xl font-bold pb-4">Dashboard</h1>
			<div className="w-xs pb-12 text-gray-500">
				<Select id="sort" options={sortOptions} />
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
					{data.map((row) => (
						<tr
							onClick={() =>
								navigate({ to: "/ticket/$id", params: { id: row.id_ticket } })
							}
							key={row.id_ticket}
							className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
						>
							<td className="text-left text-sm font-semibold text-gray-800 py-5 pr-6">
								{row.username}
							</td>
							<td className="text-left text-sm text-gray-700 pr-6">
								{row.title}
							</td>
							<td className="text-left pr-6">
								<span
									className={`inline-block text-xs px-3 py-1 rounded-md font-medium ${statutStyles[row.id_status]}`}
								>
									{row.id_status}
								</span>
							</td>
							<td className="text-left text-sm pr-6">
								<span className="italic text-gray-400">En attente</span>
							</td>
							<td className="text-left text-sm text-gray-600 pr-6">
								{row.created_at}
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
