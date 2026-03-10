import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Button from "../components/Button";
import FormField from "../components/FormField";
import InputText from "../components/InputText";
import { useUserStore } from "../store/userStore";
import type { RegisterData } from "../utils/UserApi";
import { registerUserApi } from "../utils/UserApi";

export default function RegisterForm() {
	const navigate = useNavigate();

	const setUser = useUserStore((state) => state.setUser);

	const [formData, setFormData] = useState<RegisterData>({
		username: "",
		email: "",
		password: "",
		role: "user",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		registerUserApi(formData)
			.then((response) => {
				console.log("User registered successfully:", response);
				setUser({
					id_user: response.data.id_user,
					username: response.data.username,
					email: response.data.email,
					role: response.data.role,
				});
				navigate({ to: "/create-ticket" });
			})
			.catch((error: Error) => {
				console.error("Error registering user:", error);
			});
	};

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-2xl px-4">
				<div className="bg-white px-12 py-14 shadow-md rounded-xl">
					<h1 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
						S'inscrire
					</h1>
					<form className="space-y-6" onSubmit={handleSubmit}>
						<FormField id="user" label="Nom d'utilisateur">
							<InputText
								id="user"
								placeholder="Entrez votre nom d'utilisateur"
								required
								onChange={handleInputChange}
							/>
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
						</FormField>
						<div className="flex items-center pt-1">
							<input
								id="remember_me"
								name="remember_me"
								type="checkbox"
								className="h-4 w-4 rounded border-gray-300 text-blue-400 focus:ring-blue-400"
							/>
							<label
								htmlFor="remember_me"
								className="ml-2.5 block text-sm text-gray-600"
							>
								Se souvenir de moi
							</label>
						</div>
						<Button
							type="submit"
							title="S'inscrire"
							onClick={() => navigate({ to: "/create-ticket" })}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
