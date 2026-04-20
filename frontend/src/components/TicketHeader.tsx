interface TicketHeaderProps {
	statusName: string;
	isAdmin: boolean;
	pendingConfirmation: boolean;
	onBack: () => void;
	onResolve: () => void;
	onConfirmResolve: () => void;
	onRejectResolve: () => void;
}

export default function TicketHeader({
	statusName,
	isAdmin,
	pendingConfirmation,
	onBack,
	onResolve,
	onConfirmResolve,
	onRejectResolve,
}: TicketHeaderProps) {
	return (
		<div className="w-full max-w-5xl flex items-center justify-between">
			<button
				type="button"
				onClick={onBack}
				className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 text-sm hover:bg-gray-50 active:scale-95 transition-all"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
					aria-hidden="true"
				>
					<path d="M19 12H5M12 5l-7 7 7 7" />
				</svg>
				Retour
			</button>

			{isAdmin && (
				<div className="relative flex items-center gap-2">
					<button
						type="button"
						onClick={onResolve}
						disabled={statusName === "Résolu" || statusName === "Fermé"}
						className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-300 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-green-50 disabled:active:scale-100"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="14"
							height="14"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<polyline points="20 6 9 17 4 12" />
						</svg>
						{statusName === "Résolu" || statusName === "Fermé"
							? statusName
							: "Marquer comme résolu"}
					</button>

					{pendingConfirmation && (
						<div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-gray-200 bg-white shadow-lg z-50 p-4">
							<p className="text-sm font-semibold text-gray-800 mb-1">
								Votre problème a-t-il été résolu ?
							</p>
							<p className="text-xs text-gray-500 mb-4 leading-relaxed">
								L'équipe support a marqué ce ticket comme résolu. Confirmez pour
								clôturer définitivement, ou rouvrez-le si le problème persiste.
							</p>
							<div className="flex gap-2">
								<button
									type="button"
									onClick={onConfirmResolve}
									className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-green-300 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 active:scale-95 transition-all"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<polyline points="20 6 9 17 4 12" />
									</svg>
									Confirmer
								</button>
								<button
									type="button"
									onClick={onRejectResolve}
									className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 active:scale-95 transition-all"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="13"
										height="13"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
										aria-hidden="true"
									>
										<path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0M12 8v4M12 16h.01" />
									</svg>
									Rouvrir
								</button>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
