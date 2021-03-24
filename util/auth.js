import {parse} from "cookie";

const jwt = require("jsonwebtoken");

export function createNewToken({user_id, email, name}) {
	return jwt.sign({email, name}, process.env.JWT_SECRET, {subject: `${user_id}`, issuer: "cam.quiz", audience: "cam.quiz", expiresIn: "1w"});
}

export function getCookies(req) {
	if(req.cookies) {
		return req.cookies;
	}
	const cookie = req.headers?.cookie;
	return parse(cookie || "");
}

export function getCookieToken(req) {
	const cookies = getCookies(req);
	return cookies["token"];
}