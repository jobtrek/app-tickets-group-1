import type { ReactNode } from "react";

interface NavbarButtonProps {
	text: string;
	icon: ReactNode;
	onClick?: () => void;
}

export function NavbarButton({ text, icon, onClick }: NavbarButtonProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className="px-3 py-3 text-base font-medium text-white bg-zinc-900 hover:bg-zinc-800 active:bg-zinc-700 transition-colors rounded-md border border-zinc-700 w-full flex items-center gap-3 mr-5"
		>
			{icon}
			{text}
		</button>
	);
}
