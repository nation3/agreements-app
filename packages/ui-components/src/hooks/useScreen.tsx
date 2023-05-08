import { useEffect, useState } from "react";

export enum ScreenType {
	Mobile,
	Desktop,
}

const reportScreen: () => ScreenType = () => {
	if (typeof window !== "undefined") {
		const w = window.innerWidth;
		if (w < 768) {
			return ScreenType.Mobile;
		}
	}
	return ScreenType.Desktop;
};

export const useScreen = () => {
	const [screen, setScreen] = useState(reportScreen());

	useEffect(() => {
		const handleChange = () => {
			setScreen(reportScreen());
		};

		window.addEventListener("resize", handleChange);

		return () => {
			window.removeEventListener("resize", handleChange);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return { screen };
};
