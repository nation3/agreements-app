import React from "react";

export const FancyLink = ({ href, caption }: { href: string; caption: string }) => (
	<a
		className="group flex w-fit items-center gap-0.5 font-semibold bg-gradient-to-r from-bluesky to-greensea bg-clip-text text-transparent mt-2 cursor-pointer"
		href={href}
		target="_blank"
	>
		{caption}
		<span className="group-hover:ml-1 transition-all">→</span>
	</a>
);
