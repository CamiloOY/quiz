import React from "react";
import Link from "next/link";

export default function TextLink(props) {
	const {href, children, ...rest} = props;
	return <Link href={href}><a {...rest} className="text-lightBlue-500 font-semibold hover:text-lightBlue-400">{children}</a></Link>
};