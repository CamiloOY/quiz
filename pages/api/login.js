import nc from "next-connect";
import { createNewToken } from "../../util/auth";
import {verifyUser} from "../../util/db";
import { serialize } from "cookie";
import schema from "../../schemas/loginSchema";
import bodyParser from "../../middleware/bodyParser";
import {validate} from "../../middleware/validate";

const handler = nc().use(bodyParser).use(validate(schema)).post(async (req, res) => {
	const {email, password} = req.body;
	try {
		let user = await verifyUser(email, password);
		if(!user) {
			return res.status(401).json({message: "Incorrect password"});
		}
		delete user.password;
		const token = createNewToken(user);
		const token_cookie = serialize("token", token, {sameSite: "strict", httpOnly: true, path: "/", secure: process.env.NODE_ENV === "production"});
		const auth_cookie = serialize("isAuthenticated", true, {sameSite: "strict", httpOnly: false, path: "/", secure: process.env.NODE_ENV === "production"});
		res.setHeader("SET-COOKIE", [token_cookie, auth_cookie]);
		res.json({...user});
	}
	catch(err) {
		console.log(err);
		if(err.message === "This user doesn't exist") {
			res.status(400).json({message: err.message});
		}
		else {
			res.status(500).json({message: "Something went wrong"});
		}
	}
});

export default handler;