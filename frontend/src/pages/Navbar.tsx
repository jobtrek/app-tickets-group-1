import { useNavigate } from "@tanstack/react-router";
import { NavbarButton } from "../components/NavbarButton";
import { DashboardIcon } from "../components/svg/DashboardIcon";
import { StatisticsIcon } from "../components/svg/StatisticsIcon";
import { TicketHistoryIcon } from "../components/svg/TicketHistoryIcon";

export function Navbar() {
	const navigate = useNavigate();

	return (
		<div className="flex flex-col gap-3 m-3 h-full w-48 items-center px-8 py-4 ">
			<NavbarButton
				icon={<DashboardIcon />}
				text="Dashboard"
				onClick={() => navigate({ to: "/dashboard" })}
			/>
			<NavbarButton
				icon={<TicketHistoryIcon />}
				text="Create Ticket"
				onClick={() => navigate({ to: "/create-ticket" })}
			/>
			<NavbarButton
				icon={<TicketHistoryIcon />}
				text="Register Account"
				onClick={() => navigate({ to: "/register" })}
			/>
			<NavbarButton icon={<StatisticsIcon />} text="Statistics" />
		</div>
	);
}
