import React, { createContext, useContext, useEffect, useReducer } from "react";

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
	secondRemaining: number;
}

const initialState: InitialProps = {
	questions: [],
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highScore: 0,
	secondRemaining: 0,
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

const SECS_PER_QUESTION = 30;

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
	}
}

interface QuizContextType {
	questions: QuestionProp[];
	status: "loading" | "error" | "ready" | "active" | "finished";
	index: number;
	answer: number | null;
	points: number;
	highScore: number;
	secondRemaining: number;
	numQuestions: number;
	maxPossiblePoints: number;

	dispatch: React.Dispatch<any>;
}

const defaultValue: QuizContextType = {
	questions: [],
	status: "loading",
	index: 0,
	answer: null,
	points: 0,
	highScore: 0,
	secondRemaining: 0,
	numQuestions: 0,
	maxPossiblePoints: 0,
	dispatch: () => {},
};

const QuizContext = createContext<QuizContextType>(defaultValue);

function QuizProvider({ children }: { children: React.ReactNode }) {
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
			.catch(() => dispatch({ type: "dataFailed" }));
	}, []);

	return (
		<QuizContext.Provider
			value={{
				questions,
				status,
				index,
				answer,
				points,
				highScore,
				secondRemaining,
				numQuestions,
				maxPossiblePoints,

				dispatch,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
}

function useQuiz() {
	const context = useContext(QuizContext);
	if (context == undefined)
		throw new Error("QuizContext wase used outside the QuizProvider");
	return context;
}

export { QuizProvider, useQuiz };
