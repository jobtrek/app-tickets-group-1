type Option = {
	value: string;
	label: string;
};

interface SelectProps {
	id: string;
	options: Option[];
}

export default function Select({ id, options }: SelectProps) {
	return (
		<select
			name={id}
			id={id}
			className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
		>
			{options.map((o) => (
				<option key={o.value} value={o.value}>
					{o.label}
				</option>
			))}
		</select>
	);
}
