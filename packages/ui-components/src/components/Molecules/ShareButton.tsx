import { useCallback, useMemo, useState } from "react";
import { ButtonBase } from "@nation3/ui-components";
import { ShareIcon, CheckIcon } from "@heroicons/react/20/solid";
import React from "react";

const ShareButton = ({ url }: { url: string }) => {
	const [isShared, setIsShared] = useState<boolean>(false);
	const icon = useMemo(
		() =>
			isShared ? (
				<span className="p-2 hover:bg-bluesky-600/10 rounded-lg">
					<CheckIcon className="w-6 h-6 text-bluesky-600" />
				</span>
			) : (
				<span className="p-2">
					<ShareIcon className="w-6 h-6" />
				</span>
			),
		[isShared],
	);

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
		<div>
			<ButtonBase className="bg-transparent hover:bg-gray-50 text-gray-500" onClick={() => copy()}>
				{icon}
			</ButtonBase>
		</div>
	);
};
