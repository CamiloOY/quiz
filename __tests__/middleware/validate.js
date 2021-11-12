import {validate} from "../../middleware/validate";
import {createMocks} from "node-mocks-http";

describe("validate middleware", () => {
	it("should return a 400 error when no data is provided", async () => {
		const {req, res} = createMocks();
		const next = jest.fn();
		const schema = {};
		schema.validate = jest.fn((payload, options) => {throw {errors: ["a is required", "b is required", "c is required"]}});
		
		await validate(schema)(req, res, next);
		expect(next).not.toHaveBeenCalled();
		expect(res._getStatusCode()).toBe(400);
		const json = res._getJSONData();
		expect(json.message.length).toBe(3);
		expect(schema.validate).toHaveBeenCalled();
		expect(schema.validate).toHaveBeenCalledWith(req.body, {abortEarly: false});
	});

	it("should call the next middleware when the validation passes", async () => {
		const {req, res} = createMocks();
		const next = jest.fn();
		req.body = {name: "FAKE_NAME", email: "FAKE@FAKE.FAKE", password: "FAKE_PASSWORD"};
		const schema = {};
		schema.validate = jest.fn((payload, options) => {});

		await validate(schema)(req, res, next);
		expect(next).toHaveBeenCalled();
		expect(schema.validate).toHaveBeenCalled();
		expect(schema.validate).toHaveBeenCalledWith(req.body, {abortEarly: false});
	});
});