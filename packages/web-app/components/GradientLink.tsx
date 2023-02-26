import React from "react";

export const GradientLink = ({ href, caption }: { href: string; caption: string }) => (
	<a
		className="group flex w-fit items-center gap-0.5 font-semibold bg-gradient-to-r from-bluesky to-greensea bg-clip-text text-transparent cursor-pointer"
		href={href}
		target="_blank"
		rel="noreferrer"
	>
		{caption}
		<span className="group-hover:ml-1 mr-1 group-hover:mr-0 transition-all">→</span>
	</a>
);
