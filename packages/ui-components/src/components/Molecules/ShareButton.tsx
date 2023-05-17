import { CheckIcon } from "@heroicons/react/20/solid";
import { Tooltip } from "flowbite-react";
import React, { useCallback, useState } from "react";
import { ShareIcon } from "../../icons";
import { Body3, IconRenderer } from "../Atoms";

export const ShareButton = ({ url }: { url: string }) => {
	const [isShared, setIsShared] = useState<boolean>(false);

	const copy = useCallback(async () => {
		try {
			await navigator.share({ url });
		} catch {
			navigator.clipboard.writeText(String(url));
		}
		setIsShared(true);
		setTimeout(() => setIsShared(false), 1000);
	}, [url]);

	return (
		<div
			onClick={() => copy()}
			className="flex cursor-pointer  w-auto rounded-base pr-min2 h-full bg-white items-center gap-min2 relative"
		>
			{isShared && (
				<div className="text-xs text-neutral-c-500 absolute -top-11 bg-white p-min2 rounded-base border-2 border-neutral-c-300">
					<Tooltip style="light" animation="duration-150" content={"Copied!"}>
						{"Copied!"}
					</Tooltip>
				</div>
			)}
			<IconRenderer
				icon={isShared ? <CheckIcon className="text-pr-c-green3" /> : <ShareIcon />}
				backgroundColor={isShared ? "pr-c-green1" : "neutral-c-300"}
				size={"xs"}
			/>
			<Body3 color="neutral-c-700">Share</Body3>
		</div>
	);
};
