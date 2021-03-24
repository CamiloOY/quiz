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
	it("should return a 400 error when insufficient data is sent", async () => {
		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify({})});
			expect(res.status).toBe(400);
		}});
	});

	it("should return a 409 error when the user already exists", async () => {
		const payload = {email: "a@h.h", name: "FAKE", password: "FAKE_PASSWORD"};
		createUser.mockImplementation(() => {throw new Error()});
		doesUserExist.mockImplementation(() => true);

		await testApiHandler({handler, test: async ({fetch}) => {
			const res = await fetch({method: "POST", body: JSON.stringify(payload)});
			expect(res.status).toBe(409);
			expect(createUser).toHaveBeenCalledTimes(1);
			expect(doesUserExist).toHaveBeenCalledTimes(1);
		}});
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
			expect(parse(res.headers.get("set-cookie"))).toEqual(expect.objectContaining({token: "token123"}));
		}})
	});
});