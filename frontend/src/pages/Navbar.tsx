import { NavbarButton } from "../components/NavbarButton";
export function Navbar() {
  return (
    <div className="flex flex-col gap-3 m-3">
        <NavbarButton text="Dashboard" />
        <NavbarButton text="Tickets History" /> 
        <NavbarButton text="Statistics" /> 
    </div>
    
  );
}