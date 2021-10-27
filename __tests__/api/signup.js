import handler from "../../pages/api/signup";
import {createUser, doesUserExist} from "../../util/db";
import {testApiHandler} from "next-test-api-route-handler";
import {createNewToken} from "../../util/auth";
import {parse} from "cookie";

jest.mock("../../util/db");
jest.mock("../../util/auth");

afterEach(() => {
	jest.clearAllMocks();
});

describe("/signup", () => {
	it("should return a 409 error when the user already exists", async () => {
		const payload = {email: "a@h.h", name: "FAKE", password: "FAKE_PASSWORD"};
		jest.spyOn(console, "log").mockImplementation(() => {});
		createUser.mockImplementation(() => {throw new Error()});
		doesUserExist.mockImplementation(() => true);

		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify(payload)});
			expect(res.status).toBe(409);
			expect(createUser).toHaveBeenCalledTimes(1);
			expect(doesUserExist).toHaveBeenCalledTimes(1);
		}});
		console.log.mockRestore();
	});

	it("should return correct data when request is successful", async () => {
		const payload = {email: "FAKE@FAKE.FAKE", name: "FAKE", password: "FAKE_PASSWORD"};
		const result = {email: payload.email, name: payload.name, user_id: 5};
		createUser.mockImplementation(() => result);
		createNewToken.mockImplementation(() => "token123");

		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify(payload)});
			expect(res.status).toBe(200);
			expect(createUser).toHaveBeenCalledTimes(1);
			expect(createUser).toHaveBeenCalledWith(payload.name, payload.email, payload.password);
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
		createUser.mockImplementation(() => {throw new Error("Unknown Error")});
		doesUserExist.mockImplementation(() => false);
		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify({email: "FAKE@FAKE.FAKE", name: "FAKE_NAME", password: "FAKE_PASSWORD"})});
			expect(res.status).toBe(500);
			expect(createNewToken).not.toHaveBeenCalled();
		}});
		console.log.mockRestore();
	});
});