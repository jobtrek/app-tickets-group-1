import type { ChangeEventHandler } from "react";

interface TextAreaProps {
	placeholder: string;
	id: string;
	onChange: ChangeEventHandler<HTMLTextAreaElement>;
	value: string;
}

const MAX = 3000;

export default function TextArea({
	placeholder,
	id,
	onChange,
	value,
}: TextAreaProps) {
	return (
		<div>
			<textarea
				id={id}
				name={id}
				maxLength={MAX}
				placeholder={placeholder}
				rows={8}
				onChange={onChange}
				value={value}
				className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
			></textarea>
			<p
				className={`mt-1 text-right text-xs ${value.length >= MAX ? "text-red-500" : "text-gray-400"}`}
			>
				{value.length} / {MAX}
			</p>
		</div>
	);
}
