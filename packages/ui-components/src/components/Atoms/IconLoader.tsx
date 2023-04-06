// IconLoader.tsx
import React, { CSSProperties, FC } from "react";

export interface IconLoaderProps {
	src: string;
	alt?: string;
	size?: number | string;
	className?: string;
	style?: CSSProperties;
}

const IconLoader: FC<IconLoaderProps> = ({
	src,
	alt = "",
	size = 24,
	className = "",
	style = {},
}) => {
	const imageSize = typeof size === "number" ? `${size}px` : size;
	const imageStyle: CSSProperties = {
		width: imageSize,
		height: imageSize,
		...style,
	};

	return <img src={src} alt={alt} className={`icon-loader ${className}`} style={imageStyle} />;
};

export default IconLoader;
