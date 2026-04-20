interface CommentInputProps {
	value: string;
	onChange: (value: string) => void;
	onSubmit: () => void;
}

export default function CommentInput({
	value,
	onChange,
	onSubmit,
}: CommentInputProps) {
	return (
		<div className="mt-4">
			<textarea
				className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 bg-white resize-none focus:outline-none focus:border-blue-300 transition-colors leading-relaxed"
				rows={5}
				placeholder="Ajouter un commentaire..."
				value={value}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter" && !e.shiftKey) {
						e.preventDefault();
						onSubmit();
					}
				}}
			/>
			<div className="flex items-center justify-between mt-2">
				<span className="text-xs text-gray-400">
					Entrée pour envoyer · Maj+Entrée pour un saut de ligne
				</span>
				<button
					type="submit"
					onClick={onSubmit}
					disabled={!value.trim()}
					className="px-4 py-1.5 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
				>
					Envoyer
				</button>
			</div>
		</div>
	);
}
