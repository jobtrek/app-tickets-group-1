export interface UserSettingsFields {
	newUsername: string;
	newEmail: string;
	newPassword: string;
	confirmPassword: string;
}

export function validateUserSettings({
	newUsername,
	newEmail,
	newPassword,
	confirmPassword,
}: UserSettingsFields): Record<string, string> {
	const errors: Record<string, string> = {};

	if (!newUsername.trim())
		errors.username = "Le nom d'utilisateur est obligatoire.";
	if (!newEmail.trim())
		errors.email = "L'email est obligatoire.";
	if (newPassword && newPassword.length < 8)
		errors.password = "Le mot de passe doit contenir au moins 8 caractères.";
	if (newPassword !== confirmPassword)
		errors.confirmPassword = "Les mots de passe ne correspondent pas.";

	return errors;
}