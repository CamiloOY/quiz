import React from "react";

export default function TickBox(props) {
	const {label, field, form, ...rest} = props;
	return (
		<div className="mt-4">
			<input {...field} {...rest} type="checkbox" aria-invalid={form.errors[field.name] && form.touched[field.name]} className="mt-1 p-3 rounded-md focus:ring-lightBlue-500 focus:border-lightBlue-500 text-lightBlue-500 align-bottom" />
			<label htmlFor={props.id} className="font-medium text-grey-700 ml-1">{label}</label>
			{form.errors[field.name] && form.touched[field.name] && <div className="text-red-500 font-semibold mt-1">{form.errors[field.name]}</div>}
		</div>
	);
};