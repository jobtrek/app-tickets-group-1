import type { ChangeEventHandler } from "react";

interface InputTextProps {
	placeholder: string;
	name?: string;
	id: string;
	required?: boolean;
	type?: "text" | "password" | "email";
	onChange: ChangeEventHandler<HTMLInputElement>;
	value?: string;
}

export default function InputText({
	id,
	name,
	placeholder,
	required = false,
	type = "text",
	onChange,
	value,
	defaultValue,
}: InputTextProps) {
	return (
		<input
			type={type}
			id={id}
			name={name ?? id}
			placeholder={placeholder}
			required={required}
			onChange={onChange}
			value={value}
			defaultValue={defaultValue}
			className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
		></input>
	);
}
