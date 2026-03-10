import type { ChangeEventHandler } from "react";

interface InputTextProps {
	placeholder: string;
	id: string;
	required?: boolean;
	onChange?: ChangeEventHandler<HTMLInputElement, HTMLInputElement>;
}

export default function InputText({
	id,
	placeholder,
	required = false,
	onChange,
}: InputTextProps) {
	return (
		<input
			type="text"
			id={id}
			name={id}
			placeholder={placeholder}
			required={required}
			onChange={onChange}
			className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
		></input>
	);
}
