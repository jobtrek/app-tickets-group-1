import { useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useUserStore } from "../store/userStore";
import { logoutUser } from "../utils/userApi";

export function LogoutConfirmModal() {
	const [isOpen, setIsOpen] = useState(false);
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logoutUser();
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			useUserStore.getState().clearUser();
			navigate({ to: "/login" });
		}
	};

	return (
		<>
			<button
				type="button"
				title="Se déconnecter"
				onClick={() => setIsOpen(true)}
				className="text-zinc-300 hover:text-zinc-500 transition-colors p-0.5 rounded shrink-0"
			>
				<LogOut size={14} />
			</button>

			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<button
						type="button"
						aria-label="Fermer"
						className="absolute inset-0 bg-black/40 backdrop-blur-sm w-full cursor-default"
						onClick={() => setIsOpen(false)}
						onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
					/>

					<div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 z-10">
						<h2 className="text-xl font-black text-gray-900 mb-2">
							Se déconnecter ?
						</h2>
						<p className="text-gray-500 text-sm mb-6">
							Vous serez redirigé vers la page de connexion.
						</p>
						<div className="flex gap-3">
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="w-1/2 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
							>
								Annuler
							</button>
							<button
								type="button"
								onClick={handleLogout}
								className="w-1/2 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all"
							>
								Se déconnecter
							</button>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
