const FinishScreen = ({
	points,
	maxPossiblePoints,
	highScore,
	dispatch,
}: {
	points: number;
	maxPossiblePoints: number;
	highScore: number;
	dispatch: React.Dispatch<any>;
}) => {
	const percentage = (points / maxPossiblePoints) * 100;
	return (
		<>
			<p className="result">
				You scored <strong>{points}</strong> out of {maxPossiblePoints} (
				{Math.ceil(percentage)}%)
			</p>
			<p className="highscore">HighScore: {highScore}</p>
			<button className="btn btn-ui" onClick={() => dispatch({ type: "restart" })}>
				Restart quiz
			</button>
		</>
	);
};

export default FinishScreen;
