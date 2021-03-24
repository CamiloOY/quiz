import nc from "next-connect";
import { createNewToken } from "../../util/auth";
import {createUser, doesUserExist} from "../../util/db";
import { serialize } from "cookie";

const handler = nc().post(async (req, res) => {
	const body = typeof(req.body) === "string" ? req.body = JSON.parse(req.body) : req.body;
	const {name, email, password} = body;
	if(!name || !email || !password) {
		console.log("Insufficient data");
		res.status(400).json({message: "Insufficient data provided"});
	}
	else {
		try {
			const result = await createUser(name, email, password);
			const token = createNewToken(result);
			const cookie = serialize("token", token, {sameSite: "strict", httpOnly: true, path: "/", secure: process.env.NODE_ENV === "production"});
			res.setHeader("SET-COOKIE", cookie);
			res.json({...result});
		}
		catch(err) {
			console.log(err);
			if(doesUserExist(email)) {
				res.status(409).json({message: "A user with this email address already exists"});
			}
			else {
				res.status(500).json({message: "Something went wrong"});
			}
		}
	}
});

export default handler;