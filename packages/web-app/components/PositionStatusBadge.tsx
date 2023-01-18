import { Badge, BadgeProps } from "@nation3/ui-components";

const statusBadgeMap: { [key: number]: { message: string; color: string } } = {
	0: { message: "Pending join", color: "yellow" },
	1: { message: "Joined", color: "bluesky" },
	2: { message: "Finalized", color: "greensea" },
	3: { message: "Withdrawn", color: "gray" },
	4: { message: "Disputed", color: "red" },
};

export interface PositionStatusBadgeProps extends BadgeProps {
	status: number;
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
