import type { ReactNode } from "react";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: ReactNode;
	description?: string;
}

export function StatCard({ label, value, icon, description }: StatCardProps) {
	return (
		<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
					{label}
				</span>
				<div className="p-2 bg-blue-50 text-blue-600 rounded-lg">{icon}</div>
			</div>
			<div>
				<h3 className="text-3xl font-bold text-gray-900">{value}</h3>
				{description && (
					<p className="text-xs text-gray-400 mt-1">{description}</p>
				)}
			</div>
		</div>
	);
}
