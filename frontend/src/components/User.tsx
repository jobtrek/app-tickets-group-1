import { useUserStore } from "../store/userStore";

export default function User() {
	const username = useUserStore((state) => state.username);

	return (
		<div className="flex gap-2 items-center">
			<div className="w-15 h-15 rounded-full bg-black flex items-center justify-center text-white text-2xl font-bold uppercase">
				{username.charAt(0)}
			</div>
			<div className="flex flex-col">
				<p className="text-2xl">{username}</p>
			</div>
		</div>
	);
}
