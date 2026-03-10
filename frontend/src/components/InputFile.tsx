interface InputFileProps {
	id: string;
}

export default function InputFile({ id }: InputFileProps) {
	return (
		<label htmlFor={id}>
			<div className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm">
				<p className="text-gray-400 text-center">
					Cliquez pour ajouter ou glissez puis déposez
				</p>
				<input
					type="file"
					id={id}
					name={id}
					accept=".jpg, .jpeg, .png"
					className="w-full "
				></input>
			</div>
		</label>
	);
}
