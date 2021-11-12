import * as yup from "yup";

export default yup.object({
	email: yup.string("Invalid email").email("Invalid email").required("Email must be provided"),
	name: yup.string("Invalid name").required("Name must be provided"),
	password: yup.string("Invalid password").required("Password must be provided").min("5", "Password must be at least 5 characters")
});