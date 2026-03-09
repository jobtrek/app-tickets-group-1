import { useActionState } from "react";
import { handleClickSaveButton } from "../utils/TickesApi";
import Button from "./Button";
import FormField from "./FormField";
import InputFile from "./InputFile";
import InputText from "./InputText";
import Select from "./Select";
import TextArea from "./TextArea";

export default function Form() {
	const [state, action, pending] = useActionState(
		async (_: unknown, formData: FormData) => {
			try {
				await handleClickSaveButton(formData);
				return "Ticket added !";
			} catch (e) {
				console.error(e);
				return "Une erreur est survenue lors de la création du ticket.";
			}
		},
		null,
	);

	return (
		<>
			<form
				action={action}
				className="flex flex-col gap-12 bg-white p-8 border-2 border-solid rounded-xl border-gray-100"
			>
				<h1 className="self-center text-4xl pt-4">Nouveau Ticket</h1>

				<FormField label="Titre" id="title">
					<InputText id="title" placeholder="Résumé de votre problème" />
				</FormField>

				<FormField label="Description" id="description">
					<TextArea id="description" placeholder="Fournissez plus de détails" />
				</FormField>

				<FormField id="urgence" label="Niveau d'urgence">
					<Select id="urgence" />
				</FormField>

				<FormField label="Pièce jointe" id="img">
					<InputFile id="img" />
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
		</>
	);
}
