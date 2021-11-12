import Login from "../pages/login";
import user from "@testing-library/user-event";
import {publicAxios} from "../util/fetch";
import {render, waitFor} from "@testing-library/react";

jest.mock("../util/fetch", () => ({
	publicAxios: {
		post: jest.fn()
	}
}));

afterEach(() => {
	publicAxios.post.mockClear();
});

afterAll(() => {
	jest.clearAllMocks();
});

describe("Login page", () => {
	it("shouldn't submit when inputs don't match the schema", async () => {
		const body = {
			email: "a@h",
			password: "1234"
		};
		const {getByLabelText, getByText} = render(<Login />);
		await waitFor(() => {
			user.click(getByText("Login", {selector: "button"}));
		});
		expect(publicAxios.post).not.toHaveBeenCalled();
		user.type(getByLabelText("Email"), body.email);
		user.type(getByLabelText("Password"), body.password);
		await waitFor(() => {
			user.click(getByText("Login", {selector: "button"}));
		});
		expect(publicAxios.post).not.toHaveBeenCalled();
	});

	it("should show an error if the user doesn't exist", async () => {
		const payload = {email: "FAKE@FAKE.FAKE", password: "FAKE_PASSWORD"};
		const {getByLabelText, getByText, getByRole} = render(<Login />);
		publicAxios.post.mockImplementation((url, data) => {
			let err = {
				response: {
					data: {
						message: "This user doesn't exist"
					}
				}
			};
			throw err;
		});

		user.type(getByLabelText("Email"), payload.email);
		user.type(getByLabelText("Password"), payload.password);

		user.click(getByText("Login", {selector: "button"}));
		await waitFor(() => {
			expect(getByRole("alert")).toBeInTheDocument();
		});
		expect(publicAxios.post).toHaveBeenCalledTimes(1);
		expect(publicAxios.post).toHaveBeenCalledWith("/login", payload);
	});

	it("should show an error if the password is incorrect", async () => {
		const payload = {email: "FAKE@FAKE.FAKE", password: "FAKE_PASSWORD"};
		const {getByLabelText, getByText, getByRole} = render(<Login />);
		publicAxios.post.mockImplementation((url, data) => {
			let err = {
				response: {
					data: {
						message: "Incorrect password"
					}
				}
			};
			throw err;
		});

		user.type(getByLabelText("Email"), payload.email);
		user.type(getByLabelText("Password"), payload.password);

		user.click(getByText("Login", {selector: "button"}));
		await waitFor(() => {
			expect(getByRole("alert")).toBeInTheDocument();
		});
		expect(publicAxios.post).toHaveBeenCalledTimes(1);
		expect(publicAxios.post).toHaveBeenCalledWith("/login", payload);
	});

	it("should show a success message and reset the form on success", async () => {
		const payload = {email: "FAKE_EMAIL@FAKE.FAKE", password: "FAKE_PASSWORD"};
		publicAxios.post.mockImplementation(() => {});
		const {getByLabelText, getByText, getByRole} = render(<Login />);
		user.type(getByLabelText("Email"), payload.email);
		user.type(getByLabelText("Password"), payload.password);
		user.click(getByText("Login", {selector: "button"}));
		await waitFor(() => {
			expect(getByRole("alert")).toBeInTheDocument();
		});
		expect(publicAxios.post).toHaveBeenCalledTimes(1);
		expect(publicAxios.post).toHaveBeenCalledWith("/login", payload);

		expect(getByLabelText("Email")).toHaveValue("");
		expect(getByLabelText("Password")).toHaveValue("");
	});
});