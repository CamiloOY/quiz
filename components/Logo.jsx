import classNames from "classnames";

export default function Logo(props) {
	return <div className={classNames("font-semibold tracking-normal select-none", props.className)}>Quiz<span className="text-lightBlue-400">.</span></div>;
};