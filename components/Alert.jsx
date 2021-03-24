import React from "react";
import {VscChromeClose} from "react-icons/vsc";
import {FiAlertTriangle} from "react-icons/fi";

const classnames = require("classnames");

export default function Alert(props) {
	const {hide, variant, children, close, icon, ...rest} = props;
	const colours = {
		error: {
			normal: "bg-red-100 text-red-600 font-medium rounded-lg",
			closeButton: "hover:bg-red-200 focus:ring-red-400",
			closeIcon: "text-red-500",
			icon: "text-red-700"
		},
		success: {
			normal: "bg-green-200 text-green-700 font-medium rounded-lg",
			closeButton: "hover:bg-green-300 focus:ring-green-600",
			closeIcon: "text-green-700"
		},
		info: {
			normal: "bg-lightBlue-500 text-white font-medium rounded-lg",
			closeButton: "hover:bg-lightBlue-400"
		}
	};
	return (
		<div {...rest} role="alert" className={classnames("px-3 py-3 ", colours[variant].normal, rest.className, {"flex justify-between items-center": props.close})}>
			<div className="flex items-center">
				{icon && variant === "error" && <FiAlertTriangle className={classnames("stroke-current w-6 h-6 inline-block mr-3", colours[variant].icon)} />}
				{children}
			</div>
			{close && <button onClick={hide} className={classnames("bg-transparent focus:outline-none focus:ring-2 p-1 rounded-md", colours[variant].closeButton)}><VscChromeClose className={classnames("stroke-current w-5 h-5", colours[variant].closeIcon)} /></button>}
		</div>
	);
};