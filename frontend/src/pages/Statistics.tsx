import { Clock, Info } from "lucide-react";
import { StatCard } from "../components/StatCard";

interface StatisticsProps {
	timeToTake: number;
}

export default function Statistics({ timeToTake }: StatisticsProps) {
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
					<p className="text-sm text-gray-500">
						Indicateurs de performance en temps réel.
					</p>
				</header>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{/* Primary Metric: Average Assignment Time */}
					<StatCard
						label="Prise en charge moyenne"
						value={formatDuration(timeToTake)}
						icon={<Clock size={20} />}
						description="Délai moyen entre la création du ticket et sa première assignation."
					/>

					{/* Placeholder for future expansion */}
					<div className="bg-white border border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 gap-2 shadow-sm">
						<div className="p-2 bg-gray-50 rounded-full">
							<Info size={18} className="text-gray-300" />
						</div>
						<span className="text-sm font-medium italic">
							Nouvelles métriques bientôt
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}
