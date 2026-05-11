export function Pagination({
	page,
	totalPages,
	onPageChange,
}: {
	page: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}) {
	if (totalPages <= 1) return null;

	// Logique pour déterminer quelles pages afficher
	const getVisiblePages = () => {
		const maxVisible = 5;
		let start = Math.max(1, page - Math.floor(maxVisible / 2));
		const end = Math.min(totalPages, start + maxVisible - 1);

		// Ajuster si on est proche de la fin
		if (end - start + 1 < maxVisible) {
			start = Math.max(1, end - maxVisible + 1);
		}

		const pages = [];
		for (let i = start; i <= end; i++) {
			pages.push(i);
		}
		return {
			pages,
			showStartEllipsis: start > 1,
			showEndEllipsis: end < totalPages,
		};
	};

	const { pages, showStartEllipsis, showEndEllipsis } = getVisiblePages();

	return (
		<div className="mt-auto flex w-full items-center justify-center gap-1 border-t border-gray-100 bg-white py-8">
			<button
				disabled={page <= 1}
				onClick={() => onPageChange(page - 1)}
				className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-blue-500 disabled:opacity-30"
			>
				← <span className="hidden sm:inline">Précédent</span>
			</button>

			<div className="flex items-center gap-1">
				{showStartEllipsis && <span className="px-2 text-gray-400">...</span>}

				{pages.map((p) => (
					<button
						key={p}
						onClick={() => onPageChange(p)}
						className={`h-9 w-9 rounded-lg text-sm font-medium transition-all
                            ${
															p === page
																? "bg-blue-500 text-white shadow-md shadow-blue-200"
																: "text-gray-600 hover:bg-gray-100"
														}`}
					>
						{p}
					</button>
				))}

				{showEndEllipsis && <span className="px-2 text-gray-400">...</span>}
			</div>

			<button
				disabled={page >= totalPages}
				onClick={() => onPageChange(page + 1)}
				className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-blue-500 disabled:opacity-30"
			>
				<span className="hidden sm:inline">Suivant</span> →
			</button>
		</div>
	);
}
