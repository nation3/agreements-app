import React from "react";

interface TableProps {
	columns: string[];
	data: any[][];
	className?: string;
}

export default function Table({ columns, data, className }: TableProps) {
	return (
		<div className={`relative overflow-x-auto ${className}`}>
			<table className="w-full text-left">
				<thead className="text-gray-500 uppercase bg-gray-50 ">
					<tr>
						{columns.map((column, index) => (
							<th key={index} scope="col" className="px-6 py-3">
								{column.toUpperCase()}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="text-black">
					{data.map((row, index) => (
						<tr key={index} className="bg-white border-b">
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
}
