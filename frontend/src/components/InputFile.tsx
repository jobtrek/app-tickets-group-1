interface InputFileProps {
	id: string;
}

export default function InputFile({ id }: InputFileProps) {
	return (
		<label htmlFor={id}>
			<div className="w-full border-gray-400 border border-solid rounded-xl p-4">
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
