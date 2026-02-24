import { NavbarButton } from "../components/NavbarButton";
import { useNavigate } from "@tanstack/react-router";
import { DashboardIcon } from "../components/svg/DashboardIcon";
import { TicketHistoryIcon } from "../components/svg/TicketHistoryIcon";
import { StatisticsIcon } from "../components/svg/StatisticsIcon";

export function Navbar() {
  return (
    <div className="flex flex-col gap-3 m-3 h-full w-48 items-center px-8 py-4 ">
      <NavbarButton Icon={<DashboardIcon />} text="Dashboard" />
      <NavbarButton Icon={<TicketHistoryIcon />} text="Tickets History" />
      <NavbarButton Icon={<StatisticsIcon />} text="Statistics" />
    </div>
  );
}
