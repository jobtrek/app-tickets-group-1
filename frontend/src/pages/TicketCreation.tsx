import { useNavigate } from "@tanstack/react-router";
import { useActionState, useState } from "react";
import Button from "../components/Button";
import { Alert } from "../components/ErrorMessage";
import FormField from "../components/FormField";
import InputFile from "../components/InputFile";
import InputText from "../components/InputText";
import { Spinner } from "../components/Loading";
import Select from "../components/Select";
import TextArea from "../components/TextArea";
import { useUserStore } from "../store/userStore";
import { createTicketFromForm } from "../utils/ticketsApi";
import type { ActionState } from "../utils/types";

const urgenceOptions = [
	{ value: "", label: "Indiquez le niveau d'urgence" },
	{ value: "bas", label: "Bas" },
	{ value: "moyen", label: "Moyen" },
	{ value: "haut", label: "Haut" },
	{ value: "urgent", label: "Urgent" },
];

export default function TicketCreation() {
	const navigate = useNavigate();
	const user = useUserStore((state) => state.idUser);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [values, setValues] = useState({
		title: "",
		description: "",
		level: "",
	});

	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>,
	) => {
		setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const [state, action, pending] = useActionState(
		async (_: unknown, formData: FormData): Promise<ActionState> => {
			if (imageFile) formData.set("image", imageFile);
			const errors: Record<string, string> = {};

			const title = formData.get("title") as string;
			const urgence = formData.get("level") as string;
			const desc = formData.get("description") as string;

			if (!title.trim()) errors.title = "Le titre est obligatoire.";
			if (title.length > 20) errors.title = "Maximum 20 caractères";
			if (!desc.trim()) errors.desc = "La description est obligatoire";
			if (desc.length > 3000) errors.desc = "Maximum 3000 caractères";
			if (!urgence.trim()) errors.urgence = "Choisissez un niveau d'urgence.";

			if (Object.keys(errors).length > 0) {
				return { success: false, message: "", errors };
			}

			try {
				const { createdTicket } = await createTicketFromForm(formData, user);
				navigate({
					to: "/ticket/$id",
					params: { id: String(createdTicket.idTicket) },
				});
				return { success: true, message: "Ticket créé !" };
			} catch (e) {
				console.error(e);
				return {
					success: false,
					message: "Une erreur est survenue lors de la création du ticket.",
				};
			}
		},
		null,
	);

	return (
		<div className="flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-2xl px-4">
				<div className="bg-white px-12 py-14 shadow-md rounded-xl">
					<form action={action} className="space-y-6">
						<h1 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
							Nouveau Ticket
						</h1>

						{state && !state.success && !state.errors && (
							<Alert variant="error" message={state.message} className="mb-6" />
						)}

						<FormField label="Titre" id="title">
							<InputText
								id="title"
								placeholder="Résumé de votre problème"
								onChange={handleChange}
								value={values.title}
							/>
							<Alert variant="error" message={state?.errors?.title} />
						</FormField>

						<FormField label="Description" id="description">
							<TextArea
								id="description"
								placeholder="Fournissez plus de détails"
							/>
							<Alert variant="error" message={state?.errors?.desc} />
						</FormField>

						<FormField id="level" label="Niveau d'urgence">
							<Select
								id="level"
								options={urgenceOptions}
								onChange={handleChange}
								value={values.level}
							/>
							<Alert variant="error" message={state?.errors?.urgence} />
						</FormField>

						<FormField label="Pièce jointe" id="image">
							<InputFile id="image" onFileChange={setImageFile} />
						</FormField>

						<Button
							type="submit"
							title={pending ? <Spinner /> : "Créer le ticket"}
							disabled={pending}
						/>
					</form>
				</div>
			</div>
		</div>
	);
}
