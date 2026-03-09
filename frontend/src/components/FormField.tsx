import type { ReactNode } from "react";

interface FormFieldProps {
	id: string;
	label: string;
	children: ReactNode;
}

export default function FormField({ id, label, children }: FormFieldProps) {
	return (
		<div className="flex flex-col gap-2 w-full">
			<label htmlFor={id} className="text-2xl">
				{label}
			</label>
			{children}
		</div>
	);
}
