import { useMemo } from "react";
import { ArrowLongRightIcon, PlusIcon, MinusIcon } from "@heroicons/react/20/solid";
import { Button, IconButton, DropInput, InfoAlert } from "@nation3/ui-components";
import { utils } from "ethers";
import { useProvider } from "wagmi";

import { useAgreementCreation } from "./context/AgreementCreationContext";
import { ParticipantRow } from "../ParticipantRow";
import { CreateView } from "./context/types";

import { validateCriteria } from "../../utils/criteria";

export const AgreementCreationForm = () => {
	const provider = useProvider({ chainId: 1 });
	const { terms, positions, changeView, setTerms, setPositions } = useAgreementCreation();

	const isValidAgreement = useMemo(() => {
		if (!terms) return false;
		return validateCriteria(positions);
	}, [terms, positions]);

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
					<a className="group flex w-fit items-center gap-0.5 font-semibold bg-gradient-to-r from-bluesky to-greensea bg-clip-text text-transparent mt-2 cursor-pointer">
						Learn more
						<span className="group-hover:ml-1 transition-all">→</span>
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
					{positions.map((_, index) => (
						<div key={index} className="flex items-center">
							<ParticipantRow
								ensProvider={provider}
								positions={positions}
								index={index}
								onChange={setPositions}
							/>
							<div className="px-2">
								<IconButton
									icon={<MinusIcon className="w-6 h-6" />}
									rounded={true}
									bgColor="red"
									disabled={positions.length <= 2}
									onClick={() => setPositions(positions.filter((_, i) => i !== index))}
								/>
							</div>
						</div>
					))}
					<div className="flex justify-center">
						<IconButton
							icon={<PlusIcon className="w-6 h-6" />}
							rounded={true}
							onClick={() =>
								setPositions([...positions, { account: "", balance: utils.parseUnits("0") }])
							}
						/>
					</div>
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
