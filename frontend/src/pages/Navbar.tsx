import { useNavigate } from "@tanstack/react-router";
import {
	BarChart2,
	FilePlus,
	FileText,
	LayoutDashboard,
	LogOut,
} from "lucide-react";
import { NavbarButton } from "../components/NavbarButton";
import { useUserStore } from "../store/userStore";
import { getInitials } from "../utils/initialsLogic";
import { logoutUser } from "../utils/userApi";

export function Navbar() {
	const navigate = useNavigate();
	const username = useUserStore((state) => state.username);
	const role = useUserStore((state) => state.role);
	const isAdmin = role === "admin";

	return (
		<div className="flex flex-col h-full w-50 bg-white border-r border-zinc-200 px-2.5 py-4 gap-1">
			<p className="text-[11px] font-medium text-zinc-400 uppercase tracking-widest px-2.5 pb-3 border-b border-zinc-200 mb-1">
				Menu
			</p>

			{isAdmin && (
				<NavbarButton
					icon={<LayoutDashboard size={15} />}
					text="Tableau de bord"
					onClick={() => navigate({ to: "/dashboard" })}
				/>
			)}
			<NavbarButton
				icon={<FilePlus size={15} />}
				text="Créer un ticket"
				onClick={() => navigate({ to: "/create-ticket" })}
			/>
			<NavbarButton
				icon={<FileText size={15} />}
				text="Historique"
				onClick={() => navigate({ to: "/ticket-history" })}
			/>
			{isAdmin && (
				<NavbarButton icon={<BarChart2 size={15} />} text="Statistiques" />
			)}

			<div className="flex-1" />

			{username && (
				<div className="border-t border-zinc-200 pt-2.5">
					<div className="flex items-center gap-2 px-2.5 py-2 rounded-[7px] bg-zinc-50">
						<div className="w-7.5 h-7.5 rounded-full bg-blue-100 flex items-center justify-center text-[11px] font-medium text-blue-700 shrink-0">
							{getInitials(username)}
						</div>
						<span className="text-[13px] text-gray-700 flex-1 truncate">
							{username}
						</span>
						<button
							type="button"
							title="Se déconnecter"
							onClick={async () => {
								logoutUser();
								useUserStore.getState().clearUser();
								navigate({ to: "/login" });
							}}
							className="text-zinc-300 hover:text-zinc-500 transition-colors p-0.5 rounded shrink-0"
						>
							<LogOut size={14} />
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
