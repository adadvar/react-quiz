const StartScreen = ({
	numQuestions,
	dispatch,
}: {
	numQuestions: number;
	dispatch: React.Dispatch<any>;
}) => {
	return (
		<div className="start">
			<h2>Welcom to The React Quiz!</h2>
			<h3>{numQuestions} questions to test your mastery</h3>
			<button className="btn btn-ui" onClick={() => dispatch({ type: "start" })}>
				let's start
			</button>
		</div>
	);
};

export default StartScreen;
