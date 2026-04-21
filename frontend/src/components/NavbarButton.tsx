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
			className="px-3 py-3 hover:bg-zinc-100 hover:text-zinc-900 active:bg-zinc-100 text-zinc-900 transition-colors rounded-md border border-zinc-200 w-full flex items-center gap-3 mr-5"
		>
			{icon}
			{text}
		</button>
	);
}
