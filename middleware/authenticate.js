import * as jwt from "jsonwebtoken";
import {getCookieToken} from "../util/auth";

export default async (req, res, next) => {
	try {
		const token = getCookieToken(req);
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	}
	catch(err) {
		// console.log(err);
		if(err instanceof jwt.JsonWebTokenError) {
			res.status(401).json({message: "Unauthenticated"});
		}
		else {
			res.status(500).json({message: "Something went wrong"});
		}
	}
}