import React, { ReactNode } from "react";

export interface TableProps {
	columns: string[];
	data: ReactNode[][];
	className?: string;
}

export const Table = ({ columns, data, className }: TableProps) => {
	return (
		<div className={`relative overflow-x-auto ${className}`}>
			<table className="w-full text-left">
				<thead className="text-xs text-gray-500 uppercase">
					<tr>
						{columns.map((column, index) => (
							<th
								key={index}
								scope="col"
								className={`px-6 py-3 bg-gray-100 ${
									index == 0
										? "rounded-l-lg"
										: index == columns.length - 1
										? "rounded-r-lg"
										: "rounded-none"
								}`}
							>
								{column.toUpperCase()}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="text-black">
					{data.map((row, index) => (
						<tr key={index} className={`bg-white ${index != 0 && "border-t"}`}>
							{row.map((item, index) => (
								<td key={index} className="px-6 py-4">
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
