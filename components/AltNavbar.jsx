import React from "react";
import Button from "./Button";
import Logo from "./Logo";
import TextLink from "./TextLink";
import Link from "next/link";
import {AiOutlinePlusCircle, AiOutlineUnorderedList} from "react-icons/ai";

export default function AltNavbar(props) {
	return (
		<nav className="w-full sticky top-0">
			<div className="bg-white flex items-center py-4 px-4 justify-between">
				<Link href="/"><a><Logo className="text-3xl leading-7 h-8" /></a></Link>
				{!props.isLoggedIn && (
					<div className="flex">
						<TextLink href="/login" className="self-center mr-4">Log in</TextLink>
						<Button>Sign up</Button>
					</div>
				)}
				{props.isLoggedIn && (
					<div className="flex">
						<Link href="/create"><a title="Create" className="mr-5 group"><AiOutlinePlusCircle className="inline-block w-6 h-6 text-grey-400 group-hover:text-green-600" /><span className="hidden sm:inline align-baseline ml-1 font-semibold text-grey-700 group-hover:text-black">Create</span></a></Link>
						<Link href="/quizzes"><a title="Quizzes" className="group"><AiOutlineUnorderedList className="inline-block w-6 h-6 text-grey-400 group-hover:text-lightBlue-600" /><span className="hidden sm:inline align-baseline ml-1 font-semibold text-grey-700 group-hover:text-black">Quizzes</span></a></Link>
					</div>
				)}
			</div>
		</nav>
	);
};