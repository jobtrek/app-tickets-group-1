import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import * as v from "valibot";
import { UserLoginSchema } from "../../../backend/src/validators/authValidator";
import Button from "../components/Button";
import { Alert } from "../components/ErrorMessage";
import FormField from "../components/FormField";
import InputText from "../components/InputText";
import { useUserStore } from "../store/userStore";
import type { LoginData } from "../utils/types";
import { loginUserApi } from "../utils/userApi";

export default function LoginForm() {
	const navigate = useNavigate();
	const setUser = useUserStore((state) => state.setUser);

	const [formData, setFormData] = useState<LoginData>({
		email: "",
		password: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData: LoginData) => ({
			...prevData,
			[name]: value,
		}));
		if (errors[name]) {
			setErrors((prev) => {
				const newErrors = { ...prev };
				delete newErrors[name];
				return newErrors;
			});
		}
	};

	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMessage("");
		setErrors({});

		const result = v.safeParse(UserLoginSchema, formData);

		if (!result.success) {
			const fieldErrors: Record<string, string> = {};
			result.issues.forEach((issue) => {
				if (issue.path) {
					fieldErrors[issue.path[0].key as string] = issue.message;
				}
			});
			setErrors(fieldErrors);
			return;
		}

		try {
			const response = await loginUserApi(formData);
			setUser({
				username: response.data.username,
				email: response.data.email,
				idUser: response.data.id,
				role: response.data.role,
			});
			navigate({
				to: response.data.role === "admin" ? "/dashboard" : "/create-ticket",
			});
		} catch (error) {
			if (axios.isAxiosError(error)) {
				if (!error.response) {
					setErrorMessage("Erreur de connexion. Vérifiez votre internet.");
				} else if (error.response.status === 401) {
					setErrorMessage("Email ou mot de passe incorrect.");
				} else if (error.response.status >= 500) {
					setErrorMessage("Erreur serveur. Réessayez plus tard.");
				} else {
					setErrorMessage("Une erreur est survenue.");
				}
			} else {
				setErrorMessage("Une erreur inattendue est survenue.");
			}
		}
	};

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full  max-w-2xl px-4">
				<div className="bg-white  px-12 py-14 shadow-md rounded-xl">
					<h1 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
						Se connecter
					</h1>
					<form className="space-y-6 " onSubmit={handleSubmit}>
						<Alert variant="error" message={errorMessage} />

						<FormField id="email" label="Adresse e-mail">
							<InputText
								value=""
								id="email"
								name="email"
								placeholder="Entrez votre email"
								required
								onChange={handleInputChange}
							/>
							<Alert variant="error" message={errors.email} />
						</FormField>
						<FormField id="password" label="Mot de passe">
							<input
								id="password"
								name="password"
								type="password"
								data-testid="password"
								autoComplete="current-password"
								required
								placeholder="Entrez votre mot de passe"
								className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
								onChange={handleInputChange}
							/>
							<Alert variant="error" message={errors.password} />
						</FormField>
						<Button type="submit" title="Se connecter" />
						<p className="text-center">
							Vous n'avez pas de compte ?{" "}
							<a href="/register" className="text-blue-400 hover:underline">
								S'inscrire
							</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}
