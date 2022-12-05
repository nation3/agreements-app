import React, { MouseEventHandler, ReactNode } from "react";

export interface TableProps {
	columns: string[];
	data: ReactNode[][];
	clickHandlers?: MouseEventHandler[];
	className?: string;
}

export const Table = ({ columns, data, clickHandlers, className }: TableProps) => {
	return (
		<div className={`relative overflow-x-auto ${className}`}>
			<table className="w-full text-left">
				<thead className="sticky top-0 text-xs text-gray-500 uppercase">
					<tr>
						{columns.map((column, index) => (
							<th
								key={index}
								scope="col"
								className={`px-6 py-3 bg-gray-100 ${index == 0 ? "rounded-l-lg" : ""} ${
									index + 1 >= columns.length ? "rounded-r-lg" : ""
								}`}
							>
								{column.toUpperCase()}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="text-black overflow-y-auto">
					{data.map((row, index) => (
						<tr
							key={index}
							className={`bg-white ${index != 0 && "border-t"} ${
								clickHandlers && "cursor-pointer"
							}`}
							onClick={clickHandlers?.[index] !== undefined ? clickHandlers[index] : undefined}
						>
							{row.map((item, index) => (
								<td key={index} className={`px-6 py-4`}>
									{item}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
