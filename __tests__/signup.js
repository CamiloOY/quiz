import {render, waitFor} from "@testing-library/react";
import SignUp from "../pages/signup";
import user from "@testing-library/user-event";
import {publicAxios} from "../util/fetch";

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

describe("Signup page", () => {
	it("should show an error if the user already exists", async () => {
		const payload = {email: "a@h.h", name: "abc", password: "12345"};
		publicAxios.post.mockImplementation((url, data) => {
			let err = {
				response: {
					data: {
						message: "Email taken"
					}
				}
			};
			throw err;
		});
		const {getByLabelText, getByText, getByRole} = render(<SignUp />);
		user.type(getByLabelText("Email"), payload.email);
		user.type(getByLabelText("Name"), payload.name);
		user.type(getByLabelText("Password"), payload.password);
		user.click(getByText("Sign up"));
		await waitFor(() => {
			expect(getByRole("alert")).toBeInTheDocument();
		});
		expect(publicAxios.post).toHaveBeenCalledTimes(1);
		expect(publicAxios.post).toHaveBeenCalledWith("/signup", payload);
	});

	it("should show a success message and reset the form on success", async () => {
		const payload = {email: "FAKE_EMAIL@FAKE.FAKE", name: "FAKE", password: "FAKE_PASSWORD"};
		publicAxios.post.mockImplementation(() => {});
		const {getByLabelText, getByText, getByRole} = render(<SignUp />);
		user.type(getByLabelText("Email"), payload.email);
		user.type(getByLabelText("Name"), payload.name);
		user.type(getByLabelText("Password"), payload.password);
		user.click(getByText("Sign up"));
		await waitFor(() => {
			expect(getByRole("alert")).toBeInTheDocument();
		});
		expect(publicAxios.post).toHaveBeenCalledTimes(1);
		expect(publicAxios.post).toHaveBeenCalledWith("/signup", payload);

		expect(getByLabelText("Email")).toHaveValue("");
		expect(getByLabelText("Name")).toHaveValue("");
		expect(getByLabelText("Password")).toHaveValue("");
	});

	it("shouldn't submit when inputs don't match the schema", async () => {
		const body = {
			email: "a@h",
			name: "a",
			password: "1234"
		};
		const {getByLabelText, getByText} = render(<SignUp />);
		publicAxios.post.mockImplementation(() => {});
		await waitFor(() => {
			user.click(getByText("Sign up"));
		});
		expect(publicAxios.post).not.toHaveBeenCalled();
		user.type(getByLabelText("Email"), body.email);
		user.type(getByLabelText("Name"), body.name);
		user.type(getByLabelText("Password"), body.password);
		await waitFor(() => {
			user.click(getByText("Sign up"));
		});
		expect(publicAxios.post).not.toHaveBeenCalled();
	});
});