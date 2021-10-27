import React from "react";
import Link from "next/link";
import classNames from "classnames";

export default function TextLink(props) {
	const {href, children, className, ...rest} = props;
	return <Link href={href}><a {...rest} className={classNames("text-lightBlue-500 font-semibold hover:text-lightBlue-400", className)}>{children}</a></Link>
};