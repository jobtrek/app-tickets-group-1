import { useState } from "react";

interface TextAreaProps {
	placeholder: string;
	id: string;
}

const MAX = 3000;

export default function TextArea({ placeholder, id }: TextAreaProps) {
	const [count, setCount] = useState(0);
	const [descValue, setDescValue] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescValue(e.target.value);
		setCount(e.target.value.length);
	};

	return (
		<div>
			<textarea
				id={id}
				name={id}
				maxLength={MAX}
				placeholder={placeholder}
				rows={8}
				onChange={handleChange}
				value={descValue}
				className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
			></textarea>
			<p
				className={`mt-1 text-right text-xs ${count >= MAX ? "text-red-500" : "text-gray-400"}`}
			>
				{count} / {MAX}
			</p>
		</div>
	);
}
