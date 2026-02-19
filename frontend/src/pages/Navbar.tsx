import { NavbarButton } from "../components/NavbarButton";
export function Navbar() {
  return (
    <div className="flex flex-col gap-3 m-3">
        <NavbarButton text="Dashboard" to="/dashboard" />
        <NavbarButton text="Tickets History" to="/tickethistory" />
        <NavbarButton text="Statistics" to="/" />
    </div>
    
  );
}