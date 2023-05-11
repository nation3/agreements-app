import { Badge, BadgeProps } from "@nation3/ui-components";

const statusBadgeMap: { [key: string]: { message: string; color: string } } = {
	Pending: { message: "Pending join", color: "yellow" },
	Joined: { message: "Joined", color: "bluesky" },
	Finalized: { message: "Finalized", color: "greensea" },
	Withdrawn: { message: "Withdrawn", color: "gray" },
	Disputed: { message: "Disputed", color: "red" },
};

export interface PositionStatusBadgeProps extends BadgeProps {
	status: string;
	textColor?: string;
	bgColor?: string;
	label?: string;
}

export const PositionStatusBadge = ({
	status,
	textColor,
	bgColor,
	label,
	...props
}: PositionStatusBadgeProps) => {
	const { message, color } = statusBadgeMap[status] ?? { message: "Unknown", color: "gray" };
	textColor = `${color}-800`;
	bgColor = `${color}-100`;
	label = message;

	return <Badge textColor={textColor} bgColor={bgColor} label={label} {...props} />;
};
