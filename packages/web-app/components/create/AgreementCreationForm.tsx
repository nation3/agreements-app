import { useMemo, useState } from "react";
import { ArrowLongRightIcon, PlusCircleIcon, MinusCircleIcon } from "@heroicons/react/20/solid";
import { Button, DropInput, InfoAlert } from "@nation3/ui-components";

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { ParticipantRow } from "../ParticipantRow";
import { CreateView } from "./context/types";

import { validateCriteria } from "../../utils/criteria";

export const AgreementCreationForm = () => {
	const { terms, positions, changeView, setTerms, setPositions } = useAgreementCreation();

	const isValidAgreement = useMemo(() => {
		if (!terms) return false;
		return validateCriteria(positions);
	}, [terms, positions]);

	const [participantRow, setParticipantRow] = useState([ParticipantRow]);

	// handle click event to add button.
	const handleAddClick = () => {
		setParticipantRow([...participantRow, ParticipantRow]);
	}

	// handle click event to remove button.
	const handleRemoveClick = (index: number) => {
		const list = [...participantRow];
		list.splice(index, 1);
		setParticipantRow(list);
	};

	return (
		<>
			<div className="text-gray-800">
				<h1 className="font-display font-medium text-2xl">New Agreement</h1>
			</div>
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="font-display font-medium text-xl">Agreement Terms</h2>
					<p>
						These are the terms that the parties who enter the agreement will abide by. If one of
						the parties fails to comply with these terms, their financial stake can be taken away to
						compensate the other parties. The terms must be written in Markdown.
					</p>
					<a className="flex w-fit items-center gap-0.5 font-semibold bg-gradient-to-r from-bluesky to-greensea bg-clip-text text-transparent">
						Learn more
						<ArrowLongRightIcon className="w-5 h-5 text-greensea" />
					</a>
				</div>
				<div className="flex flex-col gap-2">
					<DropInput
						dropzoneConfig={{
							accept: { "text/markdown": [".md"] },
							maxFiles: 1,
							onDrop: (acceptedFiles: File[]) => {
								acceptedFiles[0].text().then((text: string) => setTerms(text));
							},
						}}
						showFiles={true}
					/>
				</div>
			</div>
			<div className="flex flex-col gap-4">
				<div>
					<h2 className="font-display font-medium text-xl">Positions and stakes</h2>
					<p>
						These are the participants that can enter the agreement, and how much $NATION they must
						deposit to enter it.
					</p>
				</div>
				<div className="flex flex-col gap-2">
					{participantRow.map((singleParticipantRow, index) => (

						<div className="flex w-full space-x-2">
							<div className="flex-1">
								{/* TODO index > 2 = break code */}
								<ParticipantRow positions={positions} index={0} onChange={setPositions} />
							</div>

							<div className="flex space-x-2 w-[70px] items-center">
							<div className="w-[30px] h-full">
								{participantRow.length - 1 === index && (
									<button
										type="button"
										onClick={handleAddClick}
										className="h-full flex items-center"
									>
										<PlusCircleIcon className="w-7 h-7 text-[#69C9FF]" />
									</button>
								)}
							</div>

							<div className="w-[30px]">
								{participantRow.length !== 1 && participantRow.length !== 2 && (
									<button
										type="button"
										onClick={() => handleRemoveClick(index)}
										className="h-full flex items-center"
									>
										<MinusCircleIcon className="w-7 h-7 text-[#F87272]" />
									</button>
								)}
							</div>
							</div>
						</div>

					))}
				</div>
			</div>
			<div className="flex flex-col gap-2">
				{!isValidAgreement && (
					<InfoAlert message="You need to provide the terms file and at least two unique valid addresses to create an agreement." />
				)}
				<Button
					label="Create Agreement"
					disabled={!isValidAgreement}
					onClick={() => changeView(CreateView.Preview)}
				/>
			</div>
		</>
	);
};
