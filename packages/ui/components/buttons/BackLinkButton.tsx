import { ChevronLeftIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

const BackLinkButton = ({ route }: { route: string }) => {
	const router = useRouter();

	return (
		<div
			className="flex items-center gap-1 py-1 text-n3blue cursor-pointer hover:underline"
			onClick={() => router.push(route)}
		>
			<ChevronLeftIcon className="w-4 h-4" /> Back to your agreements
		</div>
	);
};

export default BackLinkButton;
