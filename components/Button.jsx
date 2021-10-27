import React from "react";
import classNames from "classnames";

export default function Button(props) {
	const {children, className, ...rest} = props;
	return (
		<button {...rest} className={classNames("bg-lightBlue-400 px-4 py-2 rounded-lg text-white font-semibold focus:ring-lightBlue-500 focus:ring-2 focus:ring-offset-2 focus:outline-none hover:bg-lightBlue-500 transition-colors",className)}>{children}</button>
	);
}