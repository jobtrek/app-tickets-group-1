// WARNING: in-memory store — counters reset on every server restart or hot-reload.
// For the login route this weakens brute-force protection. Persist to Redis or
// the database if that becomes a concern.
const store = new Map<string, number[]>();

const WINDOW_MS = 60 * 1000;

export const isRateLimited = (ip: string, limit: number): boolean => {
	const now = Date.now();
	const timestamps = store.get(ip) ?? [];

	const recent = timestamps.filter((t) => now - t < WINDOW_MS);

	if (recent.length >= limit) {
		store.set(ip, recent);
		return true;
	}

	recent.push(now);
	store.set(ip, recent);
	return false;
};
