interface SelectProps {
	id: string;
}

export default function Select({ id }: SelectProps) {
	return (
		<select
			name={id}
			id={id}
			className="w-full border-gray-400 border border-solid rounded-xl p-4 placeholder:text-gray-400"
		>
			<option value="">Indiquez le niveau d'urgence</option>
			<option value="bas">Bas</option>
			<option value="moyen">Moyen</option>
			<option value="haut">Haut</option>
			<option value="urgent">Urgent</option>
		</select>
	);
}
