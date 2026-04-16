interface UserProps {
	username: string;
}

export default function User({ username }: UserProps) {
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
