import React from "react";
import Lottie from "react-lottie";

interface AnimationLoaderProps {
	animationData: any;
	width?: number;
	height?: number;
}

export const AnimationLoader: React.FC<AnimationLoaderProps> = ({
	animationData,
	width = 100,
	height = 100,
}) => {
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};
	return (
		<div>{animationData && <Lottie options={defaultOptions} width={width} height={height} />}</div>
	);
};
