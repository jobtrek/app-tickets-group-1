export const timeAgo = (dateStr: string): string => {
	const now = new Date();
	const past = new Date(dateStr);
	const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);

	const intervals: { label: string; seconds: number }[] = [
		{ label: "an", seconds: 31536000 },
		{ label: "mois", seconds: 2592000 },
		{ label: "semaine", seconds: 604800 },
		{ label: "jour", seconds: 86400 },
		{ label: "heure", seconds: 3600 },
		{ label: "minute", seconds: 60 },
	];

	for (const interval of intervals) {
		const count = Math.floor(seconds / interval.seconds);
		if (count >= 1) {
			const plural = count > 1 && interval.label !== "mois" ? "s" : "";
			return `il y a ${count} ${interval.label}${plural}`;
		}
	}

	return "à l'instant";
};

export const getDateLabel = (dateStr: string): string => {
	const date = new Date(dateStr);
	const now = new Date();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);
	const commentDay = new Date(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
	);

	if (commentDay.getTime() === today.getTime()) return "Aujourd'hui";
	if (commentDay.getTime() === yesterday.getTime()) return "Hier";
	return date.toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
};
