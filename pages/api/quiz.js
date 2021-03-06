import nc from "next-connect";
import bodyParser from "../../middleware/bodyParser";
import {validate} from "../../middleware/validate";
import schema from "../../schemas/quizSchema";
import {createQuiz} from "../../util/db";
import authenticate from "../../middleware/authenticate";

const handler = nc().use(bodyParser).use(authenticate).use(validate(schema)).post(async (req, res) => {
	try {
		const result = await createQuiz(req.body.name, req.body.question_order_random, req.body.visibility);
		console.log(result);
		res.json({message: "Quiz created", quiz_id: result.quiz_id});
	}
	catch(err) {
		console.log(err);
		res.status(500).json({message: "Something went wrong"});
	}
});

export default handler;