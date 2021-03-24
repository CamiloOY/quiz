import { Field, Form, Formik } from "formik";
import React from "react";
import * as yup from "yup";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import {publicAxios} from "../util/fetch";
import TextLink from "../components/TextLink";
import {withRouter} from "next/router";
import Alert from "../components/Alert";
import Head from "next/head";

const validationSchema = yup.object({
	email: yup.string("Invalid email").email("Invalid email").required("Email must be provided"),
	name: yup.string("Invalid name").required("Name must be provided"),
	password: yup.string("Invalid password").required("Password must be provided").min("5")
});

const initialValues = {
	email: "",
	name: "",
	password: ""
};

class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			statusMessage: "",
			status: ""
		};
		this.onSubmit = this.onSubmit.bind(this);
	}
	
	async onSubmit(data, helpers) {
		helpers.setSubmitting(true);
		try {
			const result = await publicAxios.post("/signup", {...data});
			helpers.setSubmitting(false);
			this.setState({status: "success"});
			this.setState({statusMessage: "Signed up successfully"});
			helpers.resetForm();
			// setTimeout(() => this.props.router.push("/"), 2000);
		}
		catch(err) {
			this.setState({status: "error"});
			this.setState({statusMessage: err.response.data.message});
		}
	}

	render() {
		return (
			<>
				<Head>
					<title>Sign up to Quiz</title>
				</Head>
				<div className="flex h-screen items-center bg-gradient-to-br from-lightBlue-400 to-blue-500 px-3">
					<div className="w-full px-6 py-6 bg-white rounded-lg max-w-xl mx-auto">
						<div className="text-3xl font-semibold">Quiz<span className="text-lightBlue-400">.</span></div>
						<h1 className="text-4xl text-center font-bold text-gray-800 mt-4">Sign Up</h1>
						{this.state.statusMessage && <Alert variant={this.state.status} hide={() => this.setState({statusMessage: ""})} close className="mt-4">{this.state.statusMessage}</Alert>}
						{/* {this.state.statusMessage && <div className="">{this.state.statusMessage}</div>} */}
						<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={this.onSubmit}>
							{({isSubmitting}) => (
								<Form className="m-auto">
									<Field name="email" placeholder="Email" component={TextInput} type="email" label="Email" id="email" />
									<Field name="name" placeholder="Name" component={TextInput} type="text" label="Name" id="name" />
									<Field name="password" placeholder="Password" component={TextInput} type="password" label="Password" id="password" />
									<div className="mt-4 flex justify-end">
										<Button type="submit" disabled={isSubmitting}>Sign up</Button>
									</div>
								</Form>
							)}
						</Formik>
						<p className="mt-2 text-center">Already have an account? <TextLink href="/login">Log in</TextLink></p>
					</div>
				</div>
			</>
			// <form action="/api/signup" method="post">
			// 	<label htmlFor="email">Email</label>
			// 	<input type="email" name="email" id="email" />
			// 	<label htmlFor="name">Name</label>
			// 	<input type="text" name="name" id="name" />
			// 	<label htmlFor="password">Password</label>
			// 	<input type="password" name="password" id="password" />
			// 	<input type="submit" value="Submit" />
			// </form>
		);
	}
}

export default withRouter(SignUp);