import { Field, Form, Formik } from "formik";
import React from "react";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import {publicAxios} from "../util/fetch";
import TextLink from "../components/TextLink";
import {withRouter} from "next/router";
import Alert from "../components/Alert";
import Head from "next/head";
import validationSchema from "../schemas/signupSchema";
import Logo from "../components/Logo";

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
			await publicAxios.post("/signup", {...data});
			helpers.setSubmitting(false);
			this.setState({status: "success"});
			this.setState({statusMessage: "Signed up successfully"});
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
					<title>Sign up to Quiz</title>
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta name="description" content="Sign up to join the worlld's smallest quiz site!" />
					<meta http-equiv="Content-Type" content="text/html;charset=UTF-8" />
					<meta name="Author" content="Camilo" />
					<meta name="keywords" content="Quiz, Join Quiz, Sign up to Quiz, quizzes, online quiz, online quizzes, quiz online, free quiz site" />
				</Head>
				<div className="flex h-screen items-center bg-gradient-to-br from-lightBlue-400 to-blue-500 px-3">
					<div className="w-full px-6 py-6 bg-white rounded-lg max-w-xl mx-auto">
						<Logo className="text-3xl" />
						<h1 className="text-4xl text-center font-bold text-grey-800 mt-4">Sign Up</h1>
						{this.state.statusMessage && <Alert variant={this.state.status} hide={() => this.setState({statusMessage: ""})} close className="mt-4">{this.state.statusMessage}</Alert>}
						{/* {this.state.statusMessage && <div className="">{this.state.statusMessage}</div>} */}
						<Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={this.onSubmit}>
							{({isSubmitting}) => (
								<Form className="m-auto">
									<Field name="email" placeholder="Email" component={TextInput} type="email" label="Email" id="email" required />
									<Field name="name" placeholder="Name" component={TextInput} type="text" label="Name" id="name" required />
									<Field name="password" placeholder="Password" component={TextInput} type="password" label="Password" id="password" required />
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
		);
	}
}

export default withRouter(SignUp);