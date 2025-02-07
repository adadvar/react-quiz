import React from "react";

const NextQuestion = ({
	dispatch,
	index,
	numQuestion,
}: {
	dispatch: React.Dispatch<any>;
	index: number;
	numQuestion: number;
}) => {
	if (index < numQuestion - 1)
		return (
			<button
				className="btn btn-ui"
				onClick={() => dispatch({ type: "nextQuestion" })}
			>
				Next
			</button>
		);
	if (index === numQuestion - 1)
		return (
			<button className="btn btn-ui" onClick={() => dispatch({ type: "finish" })}>
				Finish
			</button>
		);
};

export default NextQuestion;
