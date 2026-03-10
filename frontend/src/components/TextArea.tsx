interface TextAreaProps {
	placeholder: string;
	id: string;
}

export default function TextArea({ placeholder, id }: TextAreaProps) {
	return (
		<textarea
			id={id}
			name={id}
			placeholder={placeholder}
			rows={8}
			className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
		></textarea>
	);
}
