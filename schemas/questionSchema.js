import * as yup from "yup";

export default yup.object({
	question: yup.string("Invalid question").required("You must provide a question"),
	answers: yup.array().of(yup.string("Invalid answer input").required("You must provide an answer")).min(2),
	correct_answer: yup.number().required("You must choose a correct answer").test("isValidIndex", "You must choose a correct answer", (value, context) => {
		if(value < 0 || value >= context.parent.answers.length) {
			return false;
		}
		return true;
	})
});