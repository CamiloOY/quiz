import nc from "next-connect";
import { createNewToken } from "../../util/auth";
import {createUser, doesUserExist} from "../../util/db";
import { serialize } from "cookie";
import schema from "../../schemas/signupSchema";
import bodyParser from "../../middleware/bodyParser";
import {validate} from "../../middleware/validate";

const handler = nc().use(bodyParser).use(validate(schema)).post(async (req, res) => {
	const {name, email, password} = req.body;
	try {
		const result = await createUser(name, email, password);
		const token = createNewToken(result);
		const token_cookie = serialize("token", token, {sameSite: "strict", httpOnly: true, path: "/", secure: process.env.NODE_ENV === "production"});
		const auth_cookie = serialize("isAuthenticated", true, {sameSite: "strict", httpOnly: false, path: "/", secure: process.env.NODE_ENV === "production"});
		res.setHeader("SET-COOKIE", [token_cookie, auth_cookie]);
		res.json({...result});
	}
	catch(err) {
		console.log(err);
		if(await doesUserExist(email)) {
			res.status(409).json({message: "A user with this email address already exists"});
		}
		else {
			res.status(500).json({message: "Something went wrong"});
		}
	}
});

export default handler;