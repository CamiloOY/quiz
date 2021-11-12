import React from "react";
import useSWR from "swr";

export default function SWR(props) {
	const swr = useSWR(props.key, props.fetcher, props.options);
	return props.children(swr);
}