import type React from "react";
import { useNavigate } from '@tanstack/react-router'
import { ticketInformationRoute } from 'frontend/routes/ticket.$ticketId.tsx';
import type { ReactNode } from "react";


interface NavbarButtonProps {
  text: string;
  Icon: ReactNode; 
}

export function NavbarButton( { text, Icon }: NavbarButtonProps) {

  const navigate = useNavigate();

  const handleNavigation = () =>{
    navigate({ to: ticketInformationRoute.id, params: { ticketId: "123" }});
  }
  
  return (
    <div> 
      <button onClick={handleNavigation} className="px-5 py-2.5 font-medium text-white bg-zinc-900 rounded-lg border border-zinc-700 w-[12em] flex items-center gap-2">
        {Icon}
        {text}
      </button>
    </div>
  );
}