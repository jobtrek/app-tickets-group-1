import { useNavigate } from "@tanstack/react-router";
import { useActionState, useMemo } from "react";
import Button from "../components/Button";
import { Alert } from "../components/ErrorMessage";
import FormField from "../components/FormField";
import InputText from "../components/InputText";
import { Spinner } from "../components/Loading";
import { useUserStore } from "../store/userStore";
import { createUpdateUserAction } from "../utils/userSettingsActions.ts";
export default function UserSettings() {
	const { idUser, username, email, setUser, role } = useUserStore();
	const navigate = useNavigate();

	const action = useMemo(
		() => createUpdateUserAction({ idUser, role, setUser }),
		[idUser, role, setUser],
	);

	const [state, formAction, pending] = useActionState(action, null);

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-2xl px-4">
				<div className="bg-white px-12 py-14 shadow-md rounded-xl">
					<button
						type="button"
						onClick={() => navigate({ to: "/" })}
						className="flex items-center gap-2 text-gray-500 text-sm mb-6"
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
						>
							<title>Retour</title>
							<path d="M19 12H5M12 5l-7 7 7 7" />
						</svg>
						Retour
					</button>
					<form action={formAction} className="space-y-6">
						<h1 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
							Paramètres
						</h1>

						{state?.message && (
							<Alert
								variant={state.success ? "success" : "error"}
								message={state.message}
								className="mb-6"
							/>
						)}

						<FormField label="Nom d'utilisateur" id="username">
							<InputText
								id="username"
								name="username"
								defaultValue={username}
								placeholder="Nom d'utilisateur"
							/>
							<Alert variant="error" message={state?.errors?.username} />
						</FormField>

						<FormField label="Email" id="email">
							<InputText
								id="email"
								name="email"
								defaultValue={email}
								placeholder="Email"
							/>
							<Alert variant="error" message={state?.errors?.email} />
						</FormField>

						<FormField label="Nouveau mot de passe" id="password">
							<InputText
								id="password"
								name="password"
								type="password"
								placeholder="Laisser vide pour ne pas changer"
							/>
							<Alert variant="error" message={state?.errors?.password} />
						</FormField>

						<FormField label="Confirmer le mot de passe" id="confirmPassword">
							<InputText
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="Confirmer le nouveau mot de passe"
							/>
							<Alert variant="error" message={state?.errors?.confirmPassword} />
						</FormField>

						<Button
							type="submit"
							title={pending ? <Spinner /> : "Enregistrer"}
							disabled={pending}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
