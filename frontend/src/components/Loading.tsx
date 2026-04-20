export const Spinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
	const sizes = {
		sm: "h-4 w-4 border-2",
		md: "h-8 w-8 border-4",
		lg: "h-12 w-12 border-4",
	};

	return (
		<div className="flex items-center justify-center">
			<div
				className={`
          ${sizes[size]} 
          animate-spin 
          rounded-full 
          border-gray-200 
          border-t-blue-600
        `}
			/>
		</div>
	);
};
