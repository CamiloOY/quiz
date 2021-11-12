import nc from "next-connect";
import bodyParser from "../../middleware/bodyParser";
import {validate} from "../../middleware/validate";
import schema from "../../schemas/quizSchema";
import {createQuiz} from "../../util/db";
import authenticate from "../../middleware/authenticate";

const handler = nc().use(bodyParser).use(authenticate).use(validate(schema)).post(async (req, res) => {
	res.json({message: "ok"});
});

export default handler;