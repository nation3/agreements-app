import { Badge } from "@nation3/components";

const statusBadgeMap: { [key: number]: { message: string; color: string } } = {
	0: { message: "Not joined", color: "yellow" },
	1: { message: "Joined", color: "n3blue" },
	2: { message: "Finalized", color: "purple" },
};

const PositionStatusBadge = ({ status }: { status: number }) => {
	const { message, color } = statusBadgeMap[status] ?? { message: "Unknown", color: "gray" };

	return <Badge textColor={`${color}-800`} bgColor={`${color}-100`} text={message} />;
};

export default PositionStatusBadge;
