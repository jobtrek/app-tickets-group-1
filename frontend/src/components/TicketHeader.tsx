interface TicketHeaderProps {
	statusName: string;
	isAdmin: boolean;
	isAssignedAdmin: boolean;
	pendingConfirmation: boolean;
	onBack: () => void;
	onResolve: () => void;
	onConfirmResolve: () => void;
	onRejectResolve: () => void;
	isOwner?: boolean;
}

export default function TicketHeader({
	statusName,
	
	pendingConfirmation,
	isAdmin,
	onBack,
	onResolve,
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
						disabled={
							statusName === "Résolu" ||
							statusName === "Fermé" ||
							statusName !== "En cours" ||
							pendingConfirmation
						}
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
				</div>
			)}
		</div>
	);
}
