import { CheckCircle, Clock, Ticket } from "lucide-react";
import { useState } from "react";
import type { StatsProps } from "../../src/utils/types";
import { StatCard } from "../components/StatCard";

interface StatisticsProps {
	stats: StatsProps;
}

const STATUS_LABELS: Record<number, string> = {
	1: "Ouvert",
	2: "En cours",
	3: "Résolu",
	4: "Fermé",
};

const STATUS_STYLES: Record<number, string> = {
	1: "bg-blue-50 text-blue-700",
	2: "bg-yellow-50 text-yellow-700",
	3: "bg-green-50 text-green-700",
	4: "bg-red-50 text-red-600",
};

const STATUS_ORDER = [1, 2, 3, 4];

const MONTH_LABELS = [
	"Jan",
	"Fév",
	"Mar",
	"Avr",
	"Mai",
	"Jun",
	"Jul",
	"Aoû",
	"Sep",
	"Oct",
	"Nov",
	"Déc",
];

function TicketsPerMonthChart({
	data,
}: {
	data: { month: string; count: number }[];
}) {
	const currentYear = new Date().getFullYear();

	const availableYears = Array.from(
		new Set(data.map((d) => new Date(d.month).getFullYear())),
	).sort((a, b) => b - a);

	const defaultYear = availableYears.includes(currentYear)
		? currentYear
		: (availableYears[0] ?? currentYear);

	const [selectedYear, setSelectedYear] = useState(defaultYear);

	const monthlyData = Array.from({ length: 12 }, () => 0);
	for (const d of data) {
		const date = new Date(d.month);
		if (date.getFullYear() === selectedYear) {
			monthlyData[date.getMonth()] = d.count;
		}
	}

	const W = 600;
	const H = 200;
	const pL = 32;
	const pB = 28;
	const pT = 12;
	const chartW = W - pL;
	const chartH = H - pB - pT;
	const max = Math.max(...monthlyData) * 1.15 || 1;
	const ticks = 4;
	const gap = chartW / 12;
	const barW = gap * 0.5;

	return (
		<div>
			<div className="flex justify-end mb-4">
				<select
					aria-label="Sélectionner l'année"
					value={selectedYear}
					onChange={(e) => setSelectedYear(Number(e.target.value))}
					className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
				>
					{availableYears.length > 0 ? (
						availableYears.map((y) => (
							<option key={y} value={y}>
								{y}
							</option>
						))
					) : (
						<option value={currentYear}>{currentYear}</option>
					)}
				</select>
			</div>
			<svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
				<title>Diagramme des tickets par mois</title>
				{Array.from({ length: ticks + 1 }).map((_, i) => {
					const y = pT + (chartH / ticks) * i;
					const val = Math.round(max - (max / ticks) * i);
					return (
						<g key={y}>
							<line
								x1={pL}
								x2={W}
								y1={y}
								y2={y}
								stroke="rgba(0,0,0,0.05)"
								strokeWidth="1"
							/>
							<text
								x={pL - 4}
								y={y + 4}
								textAnchor="end"
								fontSize="9"
								fill="#9ca3af"
							>
								{val}
							</text>
						</g>
					);
				})}
				{monthlyData.map((count, i) => {
					const barH = (count / max) * chartH;
					const x = pL + gap * i + (gap - barW) / 2;
					const y = count === 0 ? pT + chartH - 2 : pT + chartH - barH;
					const bH = count === 0 ? 2 : barH;
					const isEmpty = count === 0;

					return (
						<g key={MONTH_LABELS[i]}>
							<rect
								x={x}
								y={y}
								width={barW}
								height={bH}
								fill={isEmpty ? "#e5e7eb" : "#3b82f6"}
								rx="3"
							/>
							<text
								x={x + barW / 2}
								y={H - 6}
								textAnchor="middle"
								fontSize="9"
								fill="#9ca3af"
							>
								{MONTH_LABELS[i]}
							</text>
						</g>
					);
				})}
			</svg>
		</div>
	);
}

export default function Statistics({ stats }: StatisticsProps) {
	const formatDuration = (totalSeconds: number) => {
		if (!totalSeconds || totalSeconds <= 0) return "0h 0m 0s";
		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = Math.round(totalSeconds % 60);
		return `${h}h ${m}m ${s}s`;
	};

	const sortedStatuses = STATUS_ORDER.map((id) => {
		const found = stats.ticketsCountPerStatus.find((s) => s.status === id);
		return { status: id, count: found?.count ?? 0 };
	});

	return (
		<div className="min-h-screen w-full bg-gray-50 p-8">
			<div className="max-w-6xl mx-auto">
				<header className="mb-8 border-b border-gray-200 pb-4">
					<h1 className="text-2xl font-bold text-gray-900">Statistiques IT</h1>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
					<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
								Tickets par statut
							</span>
							<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
								<Ticket size={20} />
							</div>
						</div>
						<div className="flex flex-col gap-2">
							{sortedStatuses.map((s) => (
								<div
									key={s.status}
									className="flex items-center justify-between"
								>
									<span
										className={`text-xs font-medium px-2 py-1 rounded-md ${STATUS_STYLES[s.status] ?? "bg-gray-100 text-gray-500"}`}
									>
										{STATUS_LABELS[s.status] ?? `Statut ${s.status}`}
									</span>
									<span className="text-sm font-bold text-gray-900">
										{s.count}
									</span>
								</div>
							))}
						</div>
					</div>

					<StatCard
						label="Prise en charge moyenne"
						value={formatDuration(stats.avgTimeToFirstAssignment)}
						icon={<Clock size={20} />}
						description="Délai moyen entre la création du ticket et sa première assignation."
					/>

					<StatCard
						label="Fermeture de ticket moyenne"
						value={formatDuration(stats.avgTimeToCloseTicket)}
						icon={<CheckCircle size={20} />}
						description="Délai moyen entre la prise en charge du ticket et sa fermeture."
					/>
				</div>

				<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
					<h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
						Tickets par mois
					</h2>
					<TicketsPerMonthChart data={stats.ticketsPerMonth} />
				</div>
			</div>
		</div>
	);
}
