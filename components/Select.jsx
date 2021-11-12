import React from "react";

export default function Select(props) {
	const {label, field, form, children, ...rest} = props;
	return (
		<div className="mt-4">
			<label htmlFor={props.id} className="font-medium text-grey-700">{label}</label>
			<select {...field} {...rest} aria-invalid={form.errors[field.name] && form.touched[field.name]} className="border border-grey-300 mt-1 px-3 py-2 rounded-lg block w-full focus:outline-none focus:ring-1 focus:ring-lightBlue-500 focus:border-lightBlue-500">
				{children}
			</select>
			{form.errors[field.name] && form.touched[field.name] && <div className="text-red-500 font-semibold mt-1">{form.errors[field.name]}</div>}
		</div>
	);
};