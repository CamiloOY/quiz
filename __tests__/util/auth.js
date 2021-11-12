import {createNewToken, getCookies} from "../../util/auth";
import {serialize} from "cookie";

const jwt = require("jsonwebtoken");

const OLD_ENV = process.env;

beforeEach(() => {
	jest.resetModules();
	process.env = { ...OLD_ENV };
});

afterAll(() => {
	process.env = OLD_ENV;
});

describe("createNewToken", () => {
	it("should return a valid token containing user data", () => {
		process.env.JWT_SECRET = "FAKE_JWT_SECRET";
		const user = {name: "FAKE_NAME", email: "FAKE_EMAIL@FAKE.FAKE", user_id: 999};
		const token = createNewToken(user);
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		expect(decoded.email).toBe(user.email);
		expect(decoded.name).toBe(user.name);
		expect(decoded.sub).toBe("" + user.user_id);
	});
});

describe("getCookies", () => {
	it("should return cookies on the req object if they exist", () => {
		const cookies = {a: "123", b: "456"};
		const req = {cookies};
		expect(getCookies(req)).toBe(cookies);
	});

	it("should return cookies on the headers", () => {
		const cookies = {a: "123"};
		const req = {headers: {cookie: serialize("a", cookies.a)}};
		expect(getCookies(req)).toStrictEqual(cookies);
	});

	it("should return an empty object when no cookies are present", () => {
		const req = {headers: {}};
		expect(getCookies(req)).toStrictEqual({});
	});
});