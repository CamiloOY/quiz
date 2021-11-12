import handler from "../../pages/api/login";
import {verifyUser} from "../../util/db";
import {testApiHandler} from "next-test-api-route-handler";
import {createNewToken} from "../../util/auth";
import {parse} from "cookie";
import * as validate from "../../middleware/validate";

jest.mock("../../util/db");
jest.mock("../../util/auth");

beforeAll(() => {
	jest.spyOn(validate, "validate");
	validate.validate.mockImplementation(schema => (req, res, next) => {next()});
});

afterEach(() => {
	jest.clearAllMocks();
});

describe("/login", () => {
	it("should return a 401 error if the password is incorrect", async () => {
		// jest.spyOn(validate, "validate");
		verifyUser.mockImplementation((email, password) => false);
		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify({email: "FAKE@FAKE.FAKE", password: "FAKE_PASSWORD"})});
			expect(res.status).toBe(401);
			expect(createNewToken).not.toHaveBeenCalled();
		}});
	});

	it("should return a 400 error if the user doesn't exist", async () => {
		jest.spyOn(console, "log");
		console.log.mockImplementation(() => {});
		verifyUser.mockImplementation((email, password) => {throw new Error("This user doesn't exist")});
		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify({email: "FAKE@FAKE.FAKE", password: "FAKE_PASSWORD"})});
			expect(res.status).toBe(400);
			const json = await res.json();
			expect(json.message).toBe("This user doesn't exist");
			expect(createNewToken).not.toHaveBeenCalled();
		}});
		console.log.mockRestore();
	});

	it("should return correct data when request is successful", async () => {
		const payload = {email: "FAKE@FAKE.FAKE", password: "FAKE_PASSWORD"};
		const FAKE_NAME = "FAKE_NAME";
		const result = {email: payload.email, name: FAKE_NAME, user_id: 5};
		verifyUser.mockImplementation(() => result);
		createNewToken.mockImplementation(() => "token123");

		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify(payload)});
			expect(res.status).toBe(200);
			expect(verifyUser).toHaveBeenCalledTimes(1);
			expect(verifyUser).toHaveBeenCalledWith(payload.email, payload.password);
			const json = await res.json();
			expect(json).toStrictEqual(result);
			const cookieStrings = res.headers.get("set-cookie").split(", ");
			const cookies = cookieStrings.map(cookie => parse(cookie));
			expect(cookies).toEqual(expect.arrayContaining([expect.objectContaining({token: "token123"}), expect.objectContaining({isAuthenticated: "true"})]));
		}});
	});

	it("should throw a 500 error on unknown error", async () => {
		jest.spyOn(console, "log");
		console.log.mockImplementation(() => {});
		verifyUser.mockImplementation((email, password) => {throw new Error("Unknown Error")});
		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify({email: "FAKE@FAKE.FAKE", password: "FAKE_PASSWORD"})});
			expect(res.status).toBe(500);
			expect(createNewToken).not.toHaveBeenCalled();
		}});
		console.log.mockRestore();
	});
});