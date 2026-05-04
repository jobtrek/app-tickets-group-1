import { Clock } from "lucide-react";
import type { StatsProps } from "../../src/utils/types";
import { StatCard } from "../components/StatCard";

interface StatisticsProps {
	stats: StatsProps;
}

export default function Statistics({ stats }: StatisticsProps) {
	const formatDuration = (totalSeconds: number) => {
		if (!totalSeconds || totalSeconds <= 0) return "0h 0m 0s";

		const h = Math.floor(totalSeconds / 3600);
		const m = Math.floor((totalSeconds % 3600) / 60);
		const s = Math.round(totalSeconds % 60);

		return `${h}h ${m}m ${s}s`;
	};

	return (
		<div className="min-h-screen w-full bg-gray-50 p-8">
			<div className="max-w-5xl mx-auto">
				<header className="mb-8 border-b border-gray-200 pb-4">
					<h1 className="text-2xl font-bold text-gray-900">Statistiques IT</h1>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<StatCard
						label="Prise en charge moyenne"
						value={formatDuration(stats.avgTimeToFirstAssignment)}
						icon={<Clock size={20} />}
						description="Délai moyen entre la création du ticket et sa première assignation."
					/>

					<StatCard
						label="Fermeture de ticket moyenne"
						value={formatDuration(stats.avgTimeToCloseTicket)}
						icon={<Clock size={20} />}
						description="Délai moyen entre la prise en charge du ticket et sa fermeture."
					/>
				</div>
			</div>
		</div>
	);
}
