import User from "../components/User";
import { statusStyles } from "../utils/statusStyles";
import type { Ticket } from "../utils/types";

interface TicketViewProps {
	id: number;
	title: string;
	date: string;
	description: string;
	level: string;
	username: string;
	statusName: Ticket["statusName"];
}

export default function TicketView({
	id,
	title,
	description,
	date,
	level,
	username,
	statusName,
}: TicketViewProps) {
	return (
		<div className="min-h-screen w-full flex flex-col items-center py-24 px-4">
			<div className="w-full max-w-6xl border-2 rounded-xl p-10 border-gray-400">
				<div className="flex justify-between">
					<h1 className="text-3xl">{title}</h1>
					<span
						className={`p-4 ${statusStyles[statusName]} border-2 rounded-4xl w-52 text-center text-xl`}
					>
						{statusName}
					</span>
				</div>

				<p className="text-gray-400 text-lg pb-10">Crée le {date}</p>
				<hr className="border-t-2 border-gray-200 pb-5" />

				<div className="pb-10">
					<User username={username} />
				</div>

				<h2 className="text-gray-400 text-xl pb-5">Description</h2>
				<p className="pb-10">{description}</p>

				<h2 className="text-gray-400 text-xl pb-20">Pièces jointes</h2>

				<div className="w-full bg-gray-200 p-5 pb-20 rounded-xl flex gap-120">
					<div className="flex flex-col gap-2 pl-4">
						<p className="text-xs font-semibold text-gray-500">
							NIVEAU D'URGENCE
						</p>
						<p className="font-bold text-xl">{level}</p>
					</div>
					<div className="flex flex-col gap-2">
						<p className="text-xs font-semibold text-gray-500">ASSIGNÉ À</p>
						<p className="font-bold text-xl">John Doe</p>
					</div>
				</div>
			</div>
		</div>
	);
}
