import { useRouter } from "next/router";

export const useUrl = (): { url: string } => {
	const { asPath } = useRouter();
	const origin =
		typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

	const url = `${origin}${asPath}`;
	return { url };
};

export const useBuildUrl = (path: string): string => {
	const origin =
		typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

	const url = `${origin}${path}`;
	return url;
};

export const useActiveURL = () => {
	const router = useRouter();

	// Note: window is not available on the server.
	// So this code should only be used in the client side
	if (typeof window !== "undefined") {
		const protocol = window.location.protocol;
		const host = window.location.host;
		const pathname = router.asPath;
		return `${protocol}//${host}${pathname}`;
	}
	return "";
};
