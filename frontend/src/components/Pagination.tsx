export function Pagination({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="mt-auto flex w-full items-center justify-center gap-2 border-t border-gray-100 bg-white py-8">
            
            <button 
                disabled={page <= 1} 
                onClick={() => onPageChange(page - 1)}
                className="mr-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-blue-500 disabled:opacity-30"
            >
                ← <span className="hidden sm:inline">Précédent</span>
            </button>

            <div className="flex gap-1">
                {pages.map((p) => (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition-all
                            ${p === page 
                                ? 'bg-blue-500 text-white shadow-md shadow-blue-200' 
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        {p}
                    </button>
                ))}
            </div>

            <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="ml-2 px-3 py-2 text-sm font-medium text-gray-500 hover:text-blue-500 disabled:opacity-30"
            >
                <span className="hidden sm:inline">Suivant</span> →
            </button>
            
        </div>
    );
}