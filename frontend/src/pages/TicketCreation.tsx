import { useNavigate } from "@tanstack/react-router";
import { useActionState } from "react";
import Button from "../components/Button";
import FormField from "../components/FormField";
import InputFile from "../components/InputFile";
import InputText from "../components/InputText";
import Select from "../components/Select";
import TextArea from "../components/TextArea";
import { useUserStore } from "../store/userStore";
import { createTicketFromForm } from "../utils/ticketsApi";

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
	const [state, action, pending] = useActionState(
		async (_: unknown, formData: FormData) => {
			try {
				const { createdTicket } = await createTicketFromForm(formData, user);

				navigate({
					to: "/ticket/$id",
					params: { id: createdTicket.idTicket },
				});
				return "Ticket added !";
			} catch (e) {
				console.error(e);
				return "Une erreur est survenue lors de la création du ticket.";
			}
		},
		null,
	);

	return (
		<div className=" flex min-h-screen flex-col justify-center bg-gray-100 py-12 sm:px-6 lg:px-8">
			<div className="mx-auto w-full max-w-2xl px-4">
				<div className="bg-white px-12 py-14 shadow-md rounded-xl">
					<form action={action} className="space-y-6">
						<h1 className="text-center text-4xl font-extrabold text-gray-900 mb-10">
							Nouveau Ticket
						</h1>

						<FormField label="Titre" id="title">
							<InputText id="title" placeholder="Résumé de votre problème" />
						</FormField>

						<FormField label="Description" id="description">
							<TextArea
								id="description"
								placeholder="Fournissez plus de détails"
							/>
						</FormField>

						<FormField id="level" label="Niveau d'urgence">
							<Select id="level" options={urgenceOptions} />
						</FormField>

						<FormField label="Pièce jointe" id="image">
							<InputFile id="image" />
						</FormField>

						<Button type="submit" title="Créer un ticket" />
					</form>
					{(pending || state) && (
						<div className="state-text">
							{pending ? (
								<span className="loading loading-spinner loading-xl"></span>
							) : (
								state
							)}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
