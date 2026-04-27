import type { ActionState } from "../utils/types";
import { updateUser } from "../utils/userApi";
import { validateUserSettings } from "./validate";

interface UpdateUserActionParams {
	idUser: number;
	role: string;
	setUser: (user: {
		idUser: number;
		username: string;
		email: string;
		role: string;
	}) => void;
}

export function createUpdateUserAction({
	idUser,
	role,
	setUser,
}: UpdateUserActionParams) {
	return async function updateUserAction(
		_: unknown,
		formData: FormData,
	): Promise<ActionState> {
		const newUsername = formData.get("username") as string;
		const newEmail = formData.get("email") as string;
		const newPassword = formData.get("password") as string;
		const confirmPassword = formData.get("confirmPassword") as string;

		const errors = validateUserSettings({
			newUsername,
			newEmail,
			newPassword,
			confirmPassword,
		});
		if (Object.keys(errors).length > 0) {
			return { success: false, message: "", errors };
		}

		try {
			const payload: { username: string; email: string; password?: string } = {
				username: newUsername,
				email: newEmail,
			};
			if (newPassword) payload.password = newPassword;

			const updatedUser = await updateUser(idUser, payload);
			setUser({ ...updatedUser, role });
			return { success: true, message: "Profil mis à jour avec succès." };
		} catch {
			return {
				success: false,
				message: "Une erreur est survenue lors de la mise à jour.",
			};
		}
	};
}
