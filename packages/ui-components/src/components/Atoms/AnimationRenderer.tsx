import React, { useEffect, useState } from "react";
import Lottie from "react-lottie";

interface AnimationLoaderProps {
	animationFilePath: string;
	width?: number;
	height?: number;
}

const AnimationLoader: React.FC<AnimationLoaderProps> = ({
	animationFilePath,
	width = 100,
	height = 100,
}) => {
	const [animationData, setAnimationData] = useState(null);

	useEffect(() => {
		const loadAnimation = async () => {
			try {
				const loadedAnimationData = await import(`${animationFilePath}`);
				setAnimationData(loadedAnimationData.default);
			} catch (error) {
				console.error("Error loading animation:", error);
			}
		};

		loadAnimation();
	}, [animationFilePath]);

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

export default AnimationLoader;
