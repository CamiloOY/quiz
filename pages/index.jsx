import React from "react";
import {getCookieToken} from "../util/auth";
import * as jwt from "jsonwebtoken";
// import Navbar from "../components/Navbar";
import AltNavbar from "../components/AltNavbar";
import { getUserScores } from "../util/db";
import Button from "../components/Button";
import TextLink from "../components/TextLink";
import Link from "next/link";

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="min-h-screen flex flex-col bg-grey-0">
				<AltNavbar isLoggedIn={!!this.props.user} />
				{/* {this.props.user ? <pre className="h-screen">{JSON.stringify(this.props.user, null, 4)}</pre> : <p>Not logged in</p>} */}
				{this.props.scores?.length > 0 ? <pre className="h-screen">{JSON.stringify(this.props.scores, null, 4)}</pre> : (
					<div className="flex items-center flex-col justify-center flex-grow">
						<div>
							<img src="/my_answer.svg" alt="A man using a quiz" className="m-auto w-72 sm:w-80" />
							<h1 className="text-2xl text-center font-medium mt-6">You haven't taken any quizzes</h1>
							<p className="text-center text-grey-500 font-medium mt-2">Take your first quiz to have your results show up here</p>
							<Link href="/quizzes"><a><Button className="m-auto block mt-7">Start a quiz</Button></a></Link>
							<TextLink href="/create" className="text-center block mt-1">Or, create your own</TextLink>
						</div>
					</div>
				)}
				{/* <div className="h-screen bg-red-200"></div>
				<div className="h-screen bg-red-200"></div> */}
			</div>
		);
	}
}

export async function getServerSideProps(context) {
	const token = getCookieToken(context.req);
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		const scores = await getUserScores(decoded.sub);
		return {props: {user: decoded, scores}};
	}
	catch(err) {
		return {props: {}};
	}
}

export default Home;