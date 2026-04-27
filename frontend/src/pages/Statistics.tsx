interface StatisticsProps {
	timeToTake: number;
}

export function Statistics({ timeToTake }: StatisticsProps) {
	return (
		<div>
			<p>{timeToTake}</p>
		</div>
	);
}
