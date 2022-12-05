// import { useEffect, useMemo } from 'react';
export { DisputeListProvider } from "./context/DisputeListProvider";

import { Table, utils, Badge } from "@nation3/ui-components";

import { ScaleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import { useDisputeList } from "./context/DisputeListContext";

export const DisputeList = () => {
	const router = useRouter();
	const { disputes } = useDisputeList();

	return (
		<>
			{disputes && disputes.length > 0 ? (
				<Table
					className={"max-h-full"}
					columns={["Id", "Created on", "Status"]}
					data={disputes.map(({ id, createdAt, status }) => [
						<span key={id}>{utils.shortenHash(id)}</span>,
						<span key={`${id}-date`}>
							{new Date(Number(createdAt) * 1000).toLocaleDateString()}
						</span>,
						<Badge key={`${id}-status`} label={status} bgColor="slate-300" />,
					])}
					clickHandlers={disputes.map(
						({ id }) =>
							() =>
								router.push(`/dispute/${id}`),
					)}
				/>
			) : (
				<div className="flex flex-col items-center justify-center w-full h-full">
					<div className="flex flex-row items-center justify-center gap-1 max-w-md h-min">
						<ScaleIcon className="w-64 text-slate-500" strokeWidth="1" />
						<div>
							<p className="text-justify">
								Nation3 has its own system of law, enforced by its own court and secured by economic
								incentives.
							</p>
							<a className="font-semibold bg-gradient-to-r from-bluesky to-greensea bg-clip-text text-transparent">
								Learn more →
							</a>
						</div>
					</div>
				</div>
			)}
		</>
	);
};
