import { useState } from "react";
import { Alert } from "./ErrorMessage";
import InputText from "./InputText";
import { Spinner } from "./Loading";

const VITE_USER_URL = import.meta.env.VITE_USER_URL;

interface PasswordVerifyModalProps {
	onSuccess: () => void;
	onCancel: () => void;
}

export function PasswordVerifyModal({
	onSuccess,
	onCancel,
}: PasswordVerifyModalProps) {
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const handleConfirm = async () => {
		if (!password) return;
		setPending(true);
		setError(null);

		try {
			const res = await fetch(
				`${VITE_USER_URL.replace("/api/User", "")}/api/user/verify-password`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({ password }),
				},
			);

			if (res.ok) {
				onSuccess();
			} else {
				setError("Mot de passe incorrect. Veuillez réessayer.");
			}
		} catch {
			setError("Une erreur est survenue. Veuillez réessayer.");
		} finally {
			setPending(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				aria-label="Fermer"
				className="absolute inset-0 bg-black/40 backdrop-blur-sm w-full cursor-default"
				onClick={onCancel}
				onKeyDown={(e) => e.key === "Escape" && onCancel()}
			/>

			<div className="relative bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 z-10">
				<h2 className="text-xl font-black text-gray-900 mb-2">
					Confirmer votre identité
				</h2>
				<p className="text-gray-500 text-sm mb-6">
					Entrez votre mot de passe pour accéder aux paramètres.
				</p>

				<div className="flex flex-col gap-4">
					<InputText
						id="verify-password"
						name="verify-password"
						type="password"
						placeholder="Mot de passe"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					{error && <Alert variant="error" message={error} />}

					<div className="flex gap-3 mt-2">
						<button
							type="button"
							onClick={onCancel}
							className="w-1/2 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
						>
							Annuler
						</button>
						<button
							type="button"
							onClick={handleConfirm}
							disabled={!password || pending}
							className="w-1/2 py-3 rounded-xl bg-blue-500 text-white font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
						>
							{pending ? <Spinner size="sm" /> : "Confirmer"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
