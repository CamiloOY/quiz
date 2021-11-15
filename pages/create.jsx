import React from "react";
import AltNavbar from "../components/AltNavbar";
import { parse } from "cookie";
import {withRouter} from "next/router";
import SWR from "../util/swr";
import {authAxios} from "../util/fetch";
import {Formik, Form, Field, FieldArray} from "formik";
import Head from "next/head";
import quizSchema from "../schemas/quizSchema";
import TextInput from "../components/TextInput";
import TickBox from "../components/TickBox";
import Button from "../components/Button";
import Select from "../components/Select";
import questionSchema from "../schemas/questionSchema";
import AnswerInput from "../components/AnswerInput";
import QuizHeader from "../components/QuizHeader";

const quizInitialValues = {
	name: "",
	question_order_random: false,
	visibility: "Public"
};

const questionInitialValues = {
	question: "",
	answers: []
};

class Create extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			addingQuestions: true,
			questionNum: 1,
			quizTitle: ""
		};
		this.createQuiz = this.createQuiz.bind(this);
		this.addQuestion = this.addQuestion.bind(this);
	}

	async createQuiz(data, helpers) {
		console.log(data);
		try {
			helpers.setSubmitting(true);
			// Post quiz to appropriate endpoint
			const response = await authAxios.post("/quiz", data);
			// Set addingQuestions to true, set the quiz's title and id
			this.setState({addingQuestions: true, quizTitle: data.name, quiz_id: response.data.quiz_id});
		}
		catch(error) {
			console.log(error);
			helpers.setSubmitting(false);
		}
	}

	async addQuestion(data, helpers, final = false) {
		console.log("in addquestion: ", data);
		try {
			helpers.setSubmitting(true);
			const response = await authAxios.post("/question", {...data, quiz_id: this.state.quiz_id, question_position: this.state.questionNum});
			if(final) {
				// TODO: Make this redirect to quiz page
				this.props.router.push("/");
			}
			else {
				helpers.resetForm();
				this.setState(state => ({questionNum: state.questionNum + 1}));
			}
		}
		catch(error) {
			console.log(error);
			helpers.setSubmitting(false);
		}
	}

	async handleTitleChange(e, handleChange) {
		e.target.value = e.target.value.replace(/\n/g, '');
		handleChange(e);
		e.target.style.height = "auto";
		e.target.style.height = e.target.scrollHeight + "px";
		// console.log("Normal: " + e.target.value);
		// console.log("Replaced: " + e.target.value.replace(/\n/g, ''));
	}

	render() {
		return (
			<div className="min-h-screen flex flex-col">
				<Head>
					<script dangerouslySetInnerHTML={{__html: "if(!document.cookie.includes(\"isAuthenticated=true\")) {\n	window.location.href=\"/login\";\n}"}} />
				</Head>
				{this.state.addingQuestions ? (
					<>
						<Formik initialValues={questionInitialValues} validationSchema={questionSchema} onSubmit={this.addQuestion}>
							{(props) => (
								<>
									<div className="flex shadow-md flex-row p-3 justify-between items-center">
										<div className="font-semibold text-lg">{this.state.quizTitle}: Question {this.state.questionNum}</div>
										<Button onClick={() => this.addQuestion(props.values, props, true)}>Finish</Button>
									</div>
									<Form className="">
										<Field name="question" placeholder="Question" as="textarea" rows="1" wrap="hard" id="question" className="border border-grey-300 mt-1 px-3 py-2 rounded- text-3xl font-semibold block m-auto resize-none overflow-hidden focus:outline-none focus:ring-1 focus:ring-lightBlue-500 focus:border-lightBlue-500" onChange={e => this.handleTitleChange(e, props.handleChange)} required />
										<FieldArray name="answers">
											{helpers => {
												console.log(props.values);
												return (
												<div className="">
													{props.values.answers.map((answer, i) => (
														<Field name={`answers[${i}]`} placeholder="Answer text" component={AnswerInput} id={`answers[${i}]`} key={i} removeSelf={() => helpers.remove(i)} setCorrect={() => props.setFieldValue("correct_answer", i)} correct={props.values.correct_answer === i} />
													))}
													<Button type="button" onClick={() => helpers.push("")} className="mt-4">Add answer</Button>
												</div>
											)}}
										</FieldArray>
										<div className="flex justify-end fixed bottom-2 right-2"><Button type="submit" disabled={props.isSubmitting}>Add another question</Button></div>
									</Form>
								</>
							)}
						</Formik>
					</>
				) : (
					// <SWR key="/api/create" fetcher={authAxios}>
					// 	{(swr) => {
					// 		console.log("a");
					// 		return <div onClick={() => this.setState({addingQuestions: true})} className="">Title</div>;
					// 	}}
					// </SWR>
					<>
						<AltNavbar isLoggedIn />
						<h1 className="text-center text-4xl font-semibold tracking-wide">Create a new quiz</h1>
						<div className="flex items-center justify-center flex-grow">
							<Formik initialValues={quizInitialValues} validationSchema={quizSchema} onSubmit={this.createQuiz}>
								{({isSubmitting}) => (
									<Form className="w-full px-3 sm:max-w-2xl">
										<Field name="name" placeholder="Name" component={TextInput} type="text" label="Quiz Name" id="name" required />
										<Field name="visibility" component={Select} label="Visibility" id="visibility" required>
											<option value="Public">Public</option>
											<option value="Private">Private</option>
										</Field>
										<div className="flex justify-between">
											<Field name="question_order_random" component={TickBox} label="Random question order?" id="question_order_random" />
											<div className="flex justify-end mt-4">
												<Button type="submit" disabled={isSubmitting}>Create</Button>
											</div>
										</div>
									</Form>
								)}
							</Formik>
						</div>
					</>
				)}
			</div>
		);
	}
}

export default withRouter(Create);