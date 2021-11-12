import React from "react";
import Button from "./Button";
import Logo from "./Logo";
import TextLink from "./TextLink";
import Link from "next/link";
import {GiHamburgerMenu} from "react-icons/gi";
import {AiOutlinePlusCircle, AiOutlineUnorderedList} from "react-icons/ai";

class Navbar extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isOpen: true
		};
	}

	render() {
		return (
			<nav className="fixed w-full ">
				<div className="bg-white flex items-center py-4 px-4 justify-between">
					<Link href="/"><a><Logo className="text-3xl leading-7 h-8" /></a></Link>
					{!this.props.isLoggedIn && (
						<div className="flex">
							<TextLink href="/login" className="self-center mr-4">Log in</TextLink>
							<Button>Sign up</Button>
						</div>
					)}
					{this.props.isLoggedIn && <button onClick={() => this.setState(state => ({isOpen: !state.isOpen}))} className="border py-1 px-2 rounded-md border-grey-300 sm:hidden"><GiHamburgerMenu /></button>}
					{this.props.isLoggedIn && (
						<div className="hidden sm:block">
							<Link href="/create"><a className="font-semibold px-4 py-2 rounded-md hover:bg-grey-100">Create a quiz</a></Link>
							<Link href="/quizzes"><a className="font-semibold ml-1 px-4 py-2 rounded-md hover:bg-grey-100">Quizzes</a></Link>
						</div>
					)}
				</div>
				{this.props.isLoggedIn && this.state.isOpen && (
					<div className="bg-white sm:hidden">
						<ul className="px-4 pb-3">
							<Link href="/create"><a><li className="text-lg flex items-center font-medium px-3 py-2 rounded-md hover:bg-grey-100 group"><AiOutlinePlusCircle className="inline-block mr-3 w-6 h-6 text-green-500 group-hover:text-green-500" />Create a quiz</li></a></Link>
							<Link href="/quizzes"><a><li className="mt-2 text-lg flex items-center font-medium hover:bg-grey-100 px-3 py-2 rounded-md"><AiOutlineUnorderedList className="inline-block mr-3 w-6 h-6 text-lightBlue-600" />See all quizzes</li></a></Link>
						</ul>
					</div>
				)}
			</nav>
		);
	}
}

export default Navbar;