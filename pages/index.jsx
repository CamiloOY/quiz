import React from "react";
import {getCookieToken} from "../util/auth";
import * as jwt from "jsonwebtoken";

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return this.props.user ? <p>{JSON.stringify(this.props.user)}</p> : <p>Not logged in</p>;
	}
}

export async function getServerSideProps(context) {
	const token = getCookieToken(context.req);
	const decoded = jwt.verify(token, process.env.JWT_SECRET);
	return {props: {user: decoded}};
}

export default Home;