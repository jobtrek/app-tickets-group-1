import { useState } from "react";

interface TextAreaProps {
	placeholder: string;
	id: string;
}

const MAX = 3000;

export default function TextArea({ placeholder, id }: TextAreaProps) {
	const [count, setCount] = useState(0);

	return (
		<div>
			<textarea
				id={id}
				name={id}
				maxLength={MAX}
				placeholder={placeholder}
				rows={8}
				onChange={(e) => setCount(e.target.value.length)}
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
