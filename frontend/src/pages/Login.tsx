import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import Button from "../components/Button";
import FormField from "../components/FormField";
import InputText from "../components/InputText";
import { useUserStore } from "../store/userStore";
import type { LoginData } from "../utils/userApi";
import { loginUserApi } from "../utils/userApi";
export default function LoginForm() {
	const navigate = useNavigate();
	const setUser = useUserStore((state) => state.setUser);

	const [formData, setFormData] = useState<LoginData>({
		email: "",
		password: "",
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData: LoginData) => ({
			...prevData,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log(formData);
		try {
			const response = await loginUserApi(formData);
			setUser({
				username: response.data.username,
				email: response.data.email,
				idUser: response.data.id,
				role: response.data.role,
			});
			console.log("User successfully logged in:", response);
			navigate({
				to: response.data.role === "admin" ? "/dashboard" : "/create-ticket",
			});
		} catch (error) {
			console.error("Error logging in user:", error);
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
						<FormField id="email" label="Adresse e-mail">
							<InputText
								id="email"
								placeholder="Entrez votre nom d'utilisateur"
								required
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
