import type { ButtonHTMLAttributes } from "react";

interface ButtonProps {
	title: string;
	type: ButtonHTMLAttributes<HTMLButtonElement>["type"];
	onClick?: () => void;
}

export default function Button({ title, type, onClick }: ButtonProps) {
	return (
		<button
			type={type}
			className="mt-2 flex w-full justify-center rounded-lg border border-transparent bg-blue-400 p-4 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors"
			onClick={onClick}
		>
			{title}
		</button>
	);
}
