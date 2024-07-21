import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import MainContent from "./components/MainContent";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextQuestion from "./components/NextQuestion";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./components/Footer";
import Timer from "./components/Timer";

const SECS_PER_QUESTION = 30;

export interface QuestionProp {
	id: string;
	question: string;
	options: string[];
	correctOption: number;
	points: number;
}

interface InitialProps {
	questions: QuestionProp[];
	status: "loading" | "error" | "ready" | "active" | "finished";
	index: number;
	answer: number | null;
	points: number;
	highScore: number;
	secondRemaining: number | null;
}

const initialState: InitialProps = {
	questions: [],
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highScore: 0,
	secondRemaining: 10,
};

type Action =
	| { type: "dataReceived"; payload: QuestionProp[] }
	| { type: "dataFailed" }
	| { type: "start" }
	| { type: "newAnswer"; payload: number }
	| { type: "nextQuestion" }
	| { type: "finish" }
	| { type: "restart" }
	| { type: "tick" };

function reducer(state: InitialProps, action: Action): InitialProps {
	switch (action.type) {
		case "dataReceived":
			return {
				...state,
				questions: action.payload,
				status: "ready",
			};
		case "dataFailed":
			return {
				...state,
				status: "error",
			};

		case "start":
			return {
				...state,
				status: "active",
				secondRemaining: state.questions.length * SECS_PER_QUESTION,
			};

		case "newAnswer":
			const question = state.questions.at(state.index);

			return {
				...state,
				answer: action.payload,
				points:
					action.payload === question?.correctOption
						? state.points + question.points
						: state.points,
			};
		case "nextQuestion":
			return { ...state, index: state.index + 1, answer: null };

		case "finish":
			return {
				...state,
				status: "finished",
				highScore: state.points > state.highScore ? state.points : state.highScore,
			};

		case "restart":
			return { ...initialState, questions: state.questions, status: "ready" };

		case "tick":
			return {
				...state,
				secondRemaining: state.secondRemaining - 1,
				status: state.secondRemaining === 0 ? "finished" : state.status,
			};

		default:
			throw new Error("Unknown action");
	}
}

function App() {
	const [
		{ questions, status, index, answer, points, highScore, secondRemaining },
		dispatch,
	] = useReducer(reducer, initialState);

	const numQuestions = questions.length;
	const maxPossiblePoints = questions.reduce(
		(prev, cur) => prev + cur.points,
		0
	);
	useEffect(function () {
		fetch("http://localhost:8000/questions")
			.then((res) => res.json())
			.then((data) => dispatch({ type: "dataReceived", payload: data }))
			.catch((err) => dispatch({ type: "dataFailed" }));
	}, []);
	return (
		<div className="app">
			<Header />

			<MainContent>
				{status === "loading" && <Loader />}
				{status === "error" && <Error />}
				{status === "ready" && (
					<StartScreen numQuestions={numQuestions} dispatch={dispatch} />
				)}
				{status === "active" && (
					<>
						<Progress
							index={index}
							numQuestions={numQuestions}
							points={points}
							maxPossiblePoints={maxPossiblePoints}
							answer={answer}
						/>
						<Question
							question={questions[index]}
							dispatch={dispatch}
							answer={answer}
						/>
						<Footer>
							<Timer dispatch={dispatch} secondRemaining={secondRemaining} />
							{answer != null ? (
								<NextQuestion
									dispatch={dispatch}
									index={index}
									numQuestion={numQuestions}
								/>
							) : null}
						</Footer>
					</>
				)}
				{status === "finished" && (
					<FinishScreen
						maxPossiblePoints={maxPossiblePoints}
						points={points}
						highScore={highScore}
						dispatch={dispatch}
					/>
				)}
			</MainContent>
		</div>
	);
}

export default App;
