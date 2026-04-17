import { useNavigate } from "@tanstack/react-router";
import { NavbarButton } from "../components/NavbarButton";
import { CreateTicketIcon } from "../components/svg/CreateTicketIcon";
import { DashboardIcon } from "../components/svg/DashboardIcon";
import { StatisticsIcon } from "../components/svg/StatisticsIcon";
import { useUserStore } from "../store/userStore";
import { logoutUser } from "../utils/userApi";

export function Navbar() {
	const navigate = useNavigate();
	const username = useUserStore((state) => state.username);
	const role = useUserStore((state) => state.role);

	const isAdmin = role === "admin";

	return (
		<div className="flex flex-col gap-2 m-3 h-full w-56 px-4 py-4 ml-1.5">
			{isAdmin && (
				<NavbarButton
					icon={<DashboardIcon />}
					text="Dashboard"
					onClick={() => navigate({ to: "/dashboard" })}
				/>
			)}
			<NavbarButton
				icon={<CreateTicketIcon />}
				text="Create"
				onClick={() => navigate({ to: "/create-ticket" })}
			/>
			{isAdmin && <NavbarButton icon={<StatisticsIcon />} text="Statistics" />}
			<div className="my-1 border-t border-zinc-700" />
			{username ? (
				<NavbarButton
					icon={<DashboardIcon />}
					text="Logout"
					onClick={async () => {
						logoutUser();
						useUserStore.getState().clearUser();
						navigate({ to: "/login" });
					}}
				/>
			) : (
				<NavbarButton
					icon={<DashboardIcon />}
					text="Login"
					onClick={() => navigate({ to: "/login" })}
				/>
			)}
			{username && (
				<div className="mt-auto w-52">
					<div className="flex items-center gap-2 px-2 py-2.5 bg-white rounded-lg border border-white">
						<div className="relative shrink-0">
							<div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-bold uppercase">
								{username.charAt(0)}
							</div>
						</div>
						<div className="flex flex-col min-w-0">
							<span className="text-sm font-semibold text-gray-800 truncate leading-tight">
								{username}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
