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
