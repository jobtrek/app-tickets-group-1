
import type { ReactNode } from "react";

interface NavbarButtonProps {
  text: string;
  Icon: ReactNode;
  onClick?: () => void; 
}

export function NavbarButton({ text, Icon, onClick }: NavbarButtonProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(); 
    } 
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="px-5 py-2.5 font-medium text-white bg-zinc-900 rounded-lg border border-zinc-700 w-[12em] flex items-center gap-2"
      >
        {Icon}
        {text}
      </button>
    </div>
  );
}