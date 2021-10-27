import { Field, Form, Formik } from "formik";
import React from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import {publicAxios} from "../util/fetch";
import TextLink from "../components/TextLink";
import {withRouter} from "next/router";
import Alert from "../components/Alert";
import Head from "next/head";
import validationSchema from "../schemas/loginSchema";
import Logo from "../components/Logo";

const initialValues = {
	email: "",
	password: ""
};

class Login extends React.Component {
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
			await publicAxios.post("/login", {...data});
			helpers.setSubmitting(false);
			this.setState({status: "success"});
			this.setState({statusMessage: "Logged in successfully"});
			helpers.resetForm();
			setTimeout(() => this.props.router.push("/"), 1000);
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
					<title>Log in to Quiz</title>
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="description" content="Login to your quiz account" />
					<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
					<meta name="Author" content="Camilo" />
					<meta name="keywords" content="Quiz, Join Quiz, Login to Quiz, quizzes, online quiz, online quizzes, quiz online, free quiz site" />
				</Head>
				<div className="flex h-screen items-center px-3">
					<div className="w-full px-6 py-6 bg-white rounded-lg max-w-xl mx-auto">
						<h1 className="text-3xl text-center tracking-tighter">Log in to <Logo className="text-4xl text-center inline" /></h1>
						{/* <h1 className="text-3xl font-semibold text-gray-800 mt-8">Login</h1> */}
						{this.state.statusMessage && <Alert variant={this.state.status} hide={() => this.setState({statusMessage: ""})} close className="mt-4">{this.state.statusMessage}</Alert>}
						<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={this.onSubmit}>
							{({isSubmitting}) => (
								<Form className="m-auto mt-10">
									<Field name="email" placeholder="Email" component={TextInput} type="email" label="Email" id="email" required />
									<Field name="password" placeholder="Password" component={TextInput} type="password" label="Password" id="password" required />
									<div className="mt-4 flex justify-end">
										<Button type="submit" disabled={isSubmitting}>Login</Button>
									</div>
								</Form>
							)}
						</Formik>
						<p className="mt-2 text-center">Don't have an account? <TextLink href="/signup">Sign up</TextLink></p>
					</div>
				</div>
			</>
		);
	}
}

export default withRouter(Login);