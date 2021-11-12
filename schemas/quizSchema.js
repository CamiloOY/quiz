import * as yup from "yup";

export default yup.object({
	name: yup.string("Invalid name").required("Name must be provided"),
	question_order_random: yup.bool("Invalid value").required(),
	visibility: yup.string().required("Visibility must be provided").oneOf(["Public", "Private"])
});