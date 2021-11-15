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
		const {field, form, removeSelf, setCorrect, correct, ...rest} = this.props;
		return (
			<div className="mt-4 flex m-auto items-center max-w-sm">
				<div className="flex items-center focus:outline-none focus:ring-1 focus:ring-lightBlue-500 focus:border-lightBlue-500 border border-grey-300 px-2 rounded-sm w-2/3 flex-grow">
					<input checked={correct} type="checkbox" onClick={setCorrect} className="border rounded-full w-6 h-6 mr-2 cursor-pointer text-green-500 focus:ring-green-600" />
					<input {...field} {...rest} aria-invalid={form.errors[field.name] && form.touched[field.name]} className="px-0 py-2 flex-grow focus:outline-none" />
				</div>
				<IoIosRemoveCircleOutline onClick={removeSelf} className="w-7 h-7 fill-current text-warmGrey-500 hover:text-red-600 cursor-pointer ml-1" />
			</div>
		);
	}
}

export default AnswerInput;