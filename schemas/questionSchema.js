import * as yup from "yup";

export default yup.object({
	question: yup.string("Invalid question").required("You must provide a question"),
	answers: yup.array().of(yup.object({
		answer: yup.string("Invalid answer").required("You must provide an answer"),
		correct: yup.bool()
	})).min(2).test("correctAnswerRequired", "You must select an answer as correct", (value, context) => {
		let count = 0;
		for(let i = 0; i < value.length; i++) {
			if(value[i].correct) {
				count++;
				if(count > 1) {
					return false;
				}
			}
		}
		return count === 1;
	}),
	display_answers: yup.number().required().when("answers", (answers, schema) => schema.max(answers.length))
});