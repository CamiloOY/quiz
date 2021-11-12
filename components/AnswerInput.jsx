import React from "react";
import {IoIosRemoveCircleOutline} from "react-icons/io";

class AnswerInput extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			correct: false
		};
	}
	
	render() {
		const {field, form, ...rest} = this.props;
		return (
			<div className="mt-4 border border-grey-300 rounded-sm flex m-auto w-2/3 items-center focus:outline-none focus:ring-1 focus:ring-lightBlue-500 focus:border-lightBlue-500">
				<input {...field} {...rest} aria-invalid={form.errors[field.name] && form.touched[field.name]} className="px-3 py-2 " />
				<IoIosRemoveCircleOutline className="w-7 h-7 fill-current text-warmGrey-500 hover:text-red-600" />
			</div>
		);
	}
}

export default AnswerInput;