import React from "react";

export default function QuizHeader(props) {
	return (
		<div className="flex shadow-md flex-row p-3">
			<div className="font-semibold text-lg">{props.quizTitle}: Question {props.questionNumber}{props.questionCount}</div>
		</div>
	)
}