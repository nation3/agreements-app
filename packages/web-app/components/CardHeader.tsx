import React from "react";

const trimHash = (hash: string): string => {
	return `${hash.substring(2, 6)}${hash.substring(hash.length - 4)}`;
};

// FIXME: Better size selector
export const CardHeader = ({
	title,
	id,
	status,
	size,
}: {
	title: string;
	id?: string;
	status: string;
	size?: string;
}) => {
	return (
		<div className="flex flex-col">
			<h1 className={`font-display font-medium text-${size ?? "2xl"} truncate`}>
				{title} {id && `#${trimHash(id.toUpperCase())}`}
			</h1>
			<h3 className="font-display text-md text-gray-500 -mt-2">{status}</h3>
		</div>
	);
};
