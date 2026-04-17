import { useNavigate } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import * as v from "valibot";
import { UserRegisterSchema } from "../../../backend/src/validators/authValidator";
import Button from "../components/Button";
import { Alert } from "../components/ErrorMessage";
import FormField from "../components/FormField";
import InputText from "../components/InputText";
import type { RegisterData } from "../utils/types";
import { registerUserApi } from "../utils/userApi";

export default function RegisterForm() {
	const navigate = useNavigate();

	const [formData, setFormData] = useState<RegisterData>({
		username: "",
		email: "",
		password: "",
	});
	const [errorMessage, setErrorMessage] = useState("");
	const [errors, setErrors] = useState<Record<string, string>>({});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData: RegisterData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrors({});
		setErrorMessage("");

		const result = v.safeParse(UserRegisterSchema, formData);

		if (!result.success) {
			// Transforme les erreurs Valibot en un objet utilisable pour setErrors
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
			await registerUserApi(formData);
			navigate({ to: "/login" });
		} catch (error) {
			if (
				axios.isAxiosError(error) &&
				error.response?.data?.error === "Email already exists"
			) {
				setErrors({ email: "Cet email est déjà utilisé." });
			} else {
				setErrorMessage("Une erreur est survenue.");
			}
		}
	};

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-2xl px-4">
				<div className="bg-white px-12 py-14 shadow-md rounded-xl">
					<h1 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
						S'inscrire
					</h1>
					<form className="space-y-6" onSubmit={handleSubmit}>
						<FormField id="username" label="Nom d'utilisateur">
							<InputText
								id="username"
								placeholder="Entrez votre nom d'utilisateur"
								required
								onChange={handleInputChange}
							/>
							<Alert variant="error" message={errors.username} />
						</FormField>
						<FormField id="email" label="Email">
							<input
								id="email"
								name="email"
								type="email"
								required
								placeholder="Entrez votre adresse Email"
								className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
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
								className="block w-full rounded-lg border border-gray-300 px-4 py-3 mb-5 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
								onChange={handleInputChange}
							/>
							<Alert variant="error" message={errors.password} />
						</FormField>
						<Button type="submit" title="S'inscrire" />
						<p className="text-center">
							Vous avez déjà un compte ?{" "}
							<a href="/login" className="text-blue-400 hover:underline">
								Se connecter
							</a>
						</p>
					</form>
				</div>
			</div>
		</div>
	);
}
