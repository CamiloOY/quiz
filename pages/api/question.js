import nc from "next-connect";
import bodyParser from "../../middleware/bodyParser";
import {validate} from "../../middleware/validate";
import schema from "../../schemas/questionSchema";
import {addQuestion} from "../../util/db";
import authenticate from "../../middleware/authenticate";

const handler = nc().use(bodyParser).use(authenticate).use(validate(schema)).post(async (req, res) => {
	try {
		console.log(req.body);
		let wrong_answers = req.body.answers.filter((el, i) => i!==req.body.correct_answer);
		const result = await addQuestion(req.body.quiz_id, req.body.question, req.body.answers[req.body.correct_answer], wrong_answers, req.body.question_position);
		res.json({message: "Question added"});
	}
	catch(err) {
		console.log(err);
		res.status(500).json({message: "Something went wrong"});
	}
});

export default handler;