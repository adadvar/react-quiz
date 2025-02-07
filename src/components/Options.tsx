import { QuestionProp, useQuiz } from "../contexts/QuizContext";

const Options = ({ question }: { question: QuestionProp | undefined }) => {
	const { dispatch, answer } = useQuiz();
	const hasAnswered = answer != null;

	return (
		<div className="options">
			{question?.options.map((option, index) => (
				<button
					className={`btn btn-option ${index === answer ? "answer" : ""} ${
						hasAnswered
							? index === question.correctOption
								? "correct"
								: "wrong"
							: ""
					}`}
					disabled={hasAnswered}
					key={option}
					onClick={() => dispatch({ type: "newAnswer", payload: index })}
				>
					{option}
				</button>
			))}
		</div>
	);
};

export default Options;
