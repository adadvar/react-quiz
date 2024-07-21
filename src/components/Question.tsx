import { QuestionProp } from "../App";
import Options from "./Options";

const Question = ({
	question,
	dispatch,
	answer,
}: {
	question: QuestionProp;
	dispatch: React.Dispatch<any>;
	answer: number | null;
}) => {
	return (
		<div>
			<h4>{question.question}</h4>
			<Options question={question} dispatch={dispatch} answer={answer} />
		</div>
	);
};

export default Question;
