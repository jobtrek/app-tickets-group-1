import type { ChangeEventHandler } from "react";

type Option = {
	value: string;
	label: string;
};

interface SelectProps {
	id: string;
	options: Option[];
	value?: string;
	onChange?: ChangeEventHandler<HTMLSelectElement>;
}

export default function Select({ id, options, value, onChange }: SelectProps) {
	return (
		<select
			name={id}
			id={id}
			onChange={onChange}
			value={value}
			className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-0 text-sm"
		>
			{options.map((o) => (
				<option key={o.value} value={o.value}>
					{o.label}
				</option>
			))}
		</select>
	);
}
