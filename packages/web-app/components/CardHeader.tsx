import React, { ReactNode } from "react";

const trimHash = (hash: string): string => {
	return `${hash.substring(2, 6)}${hash.substring(hash.length - 4)}`;
};

// FIXME: Better size selector
export const CardHeader = ({
	title,
	id,
	status,
	size,
	actions,
}: {
	title: string;
	id?: string;
	status: string;
	size?: string;
	actions?: ReactNode;
}) => {
	return (
		<div className="flex justify-between">
			<div className="flex flex-col">
				<h1 className={`font-display font-medium text-${size ?? "2xl"} truncate`}>
					{title} {id && `#${trimHash(id.toUpperCase())}`}
				</h1>
				<h3 className="font-display text-md text-gray-500 -mt-1">{status}</h3>
			</div>
			{actions}
		</div>
	);
};
