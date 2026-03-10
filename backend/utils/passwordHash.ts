export const hashPassword = async (password: string) => {
	const hash = await Bun.password.hash(password);
	return hash;
};
