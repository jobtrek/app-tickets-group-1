import { useNavigate } from "@tanstack/react-router";
import { useUserStore } from "../store/userStore";

import { useState } from "react";
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
		setUser(formData);
		registerUserApi(formData)
			.then((response) => {
				console.log("User registered successfully:", response);
			})
			.catch((error: Error) => {
				console.error("Error registering user:", error);
			});
	};

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-lg px-4">
				<div className="bg-white px-12 py-14 shadow-md rounded-xl">
					<h1 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
						Sign Up
					</h1>
					<form className="space-y-6" onSubmit={handleSubmit}>
						<div>
							<label
								htmlFor="username"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Username
							</label>
							<input
								id="username"
								name="username"
								type="text"
								data-testid="username"
								required
								className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label
								htmlFor="email"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								required
								className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
								onChange={handleInputChange}
							/>
						</div>
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 mb-1.5"
							>
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								data-testid="password"
								autoComplete="current-password"
								required
								className="block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
								onChange={handleInputChange}
							/>
						</div>
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
								Remember me
							</label>
						</div>
						<button
							data-testid="login"
							type="submit"
							className="mt-2 flex w-full justify-center rounded-lg border border-transparent bg-blue-400 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors"
							onClick={() => navigate({ to: "/create-ticket" })}
						>
							Sign up
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}
