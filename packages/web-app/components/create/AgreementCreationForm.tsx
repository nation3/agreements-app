import { ArrowLongRightIcon } from "@heroicons/react/20/solid";
import { Button, DropInput, TextAreaInput } from "@nation3/ui-components";

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { ParticipantRow } from "../ParticipantRow";
import { CreateView } from "./context/types";

import { validateCriteria } from "../../utils/criteria";

export const AgreementCreationForm = () => {
	const { terms, positions, changeView, setTerms, setPositions } = useAgreementCreation();

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
					<a className="flex items-center gap-1 font-semibold text-n3green">
						Learn more <ArrowLongRightIcon className="w-4 h-4" />
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
					/>
					<TextAreaInput
						rows={8}
						value={terms}
						onChange={(e: any) => {
							setTerms(e.target.value);
						}}
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
					<ParticipantRow positions={positions} index={0} onChange={setPositions} />
					<ParticipantRow positions={positions} index={1} onChange={setPositions} />
				</div>
			</div>
			<Button
				label="Create Agreement"
				disabled={!validateCriteria(positions)}
				onClick={() => changeView(CreateView.Preview)}
			/>
		</>
	);
};
