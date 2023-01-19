import { useMemo, useState, useCallback, useEffect } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { BigNumber, constants, utils } from "ethers";
import { NotEnoughBalanceAlert } from "../../alerts";
import { useToken } from "../../../hooks/useToken";
import { useAgreementJoin } from "../../../hooks/useAgreement";
import { frameworkAddress, NATION, permit2Address } from "../../../lib/constants";
import { UserPosition } from "../context/types";
import { AgreementConstants } from "../AgreementConstants";

import { SignatureTransfer, PermitBatchTransferFrom } from "@uniswap/permit2-sdk";
import { Button, Steps } from "@nation3/ui-components";
import { Modal } from "flowbite-react";
import courtIcon from "../../../assets/svgs/court.svg";
import { IStep } from "@nation3/ui-components/dist/components/Organisms/steps/Steps";
import { useAgreementData } from "../context/AgreementDataContext";

export const JoinableAgreementActions = ({
	id,
	userPosition,
}: {
	id: string;
	userPosition: UserPosition;
}) => {
	// const [isJoinAgreementStarted, setisJoinAgreementStarted] = useState<boolean>(false);
	const [isAgreementIdCopied, setIsAgreementIdCopied] = useState<boolean>(false);
	const { address } = useAccount();
	const [isTermsModalUp, setIsTermsModalUp] = useState<boolean>(false);
	const [isJoinAgreementStarted, setIsJoinAgreementStarted] = useState<boolean>(false);
	const [stepsIndex, setStepsIndex] = useState<number>(0);
	const [stepsLoadingIndex, setStepsLoadingIndex] = useState<number | null>(null);
	const [stepsFinished, setStepsFinished] = useState<boolean>(false);
	const [stepsError, setStepsError] = useState<{
		header: string;
		description: string;
		isError: boolean;
	}>({
		header: "",
		description: "",
		isError: false,
	});
	const { positions, resolvers } = useAgreementData();
	const [isJoinAgreementFinished, setIsJoinAgreementFinished] = useState<boolean>(false);

	/* 
	STEPS 1 - JOIN AGREEMENT
	PERMIT 2 $TOKEN ALLOWANCE
	 */

	const {
		balance: accountTokenBalance,
		// allowance: accountTokenAllowance,
		approve,
		approvalLoading,
		approvalProcessing,
		approvalSuccess,
		approvalError,
	} = useToken({
		address: NATION,
		account: address || constants.AddressZero,
		spender: permit2Address,
		enabled: typeof address !== "undefined",
	});

	/* LISTENER APPROVAL EVENT */
	useEffect(() => {
		if (approvalSuccess) {
			setStepsIndex(stepsIndex + 1);
			setStepsLoadingIndex(null);
		} else if (approvalError) {
			setStepsLoadingIndex(null);
			setStepsError({
				header: "Approval failed ⚠️",
				description:
					"The process for the initial approval of the $NATION required failed. Please review it and confirm the signing acordingly",
				isError: true,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [approvalSuccess, approvalError]);

	/* 
	STEPS 2 - SIGN 
	 */

	const userResolver = useMemo(
		() => ({
			account: address || constants.AddressZero,
			balance: userPosition.resolver?.balance || "0",
			proof: userPosition.resolver?.proof || [],
		}),
		[address, userPosition],
	);

	const requiredBalance = useMemo((): BigNumber => {
		return BigNumber.from(userPosition.resolver?.balance || 0);
	}, [userPosition]);

	const enoughBalance = useMemo((): boolean => {
		if (accountTokenBalance) {
			return requiredBalance.lte(BigNumber.from(accountTokenBalance));
		} else {
			return true;
		}
	}, [accountTokenBalance, requiredBalance]);

	const permit: PermitBatchTransferFrom = useMemo(
		() => ({
			permitted: [
				{ token: NATION, amount: 0 },
				{ token: NATION, amount: requiredBalance },
			],
			spender: frameworkAddress,
			nonce: 0,
			deadline: constants.MaxInt256,
		}),
		[requiredBalance],
	);

	const signTypedDataConfig = useMemo(() => {
		const { types, values } = SignatureTransfer.getPermitData(permit, permit2Address, 5);
		const config = {
			domain: { name: "Permit2", chainId: 5, verifyingContract: permit2Address },
			types,
			value: values,
		};
		// console.log(config.values);
		return config;
	}, [permit]);

	const {
		data: signature,
		error: signTypeDataError,
		isError: isSignTypeDataError,
		isSuccess: isSignTypeDataSuccess,
		signTypedData,
	} = useSignTypedData(signTypedDataConfig);

	/* 
	LISTENER APPROVAL EVENT
	STEP 2 - JOIN AGREEMENT
	 */
	useEffect(() => {
		if (isSignTypeDataSuccess) {
			setStepsIndex(stepsIndex + 1);
			setStepsLoadingIndex(null);
		} else if (isSignTypeDataError) {
			setStepsLoadingIndex(null);
			setStepsError({
				header: "Signer failed",
				description:
					"The process signing failed. Please review it and confirm the signing acordingly",
				isError: true,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSignTypeDataSuccess, isSignTypeDataError]);

	const {
		join,
		isLoading: isJoinLoading,
		isSuccess: isJoinSuccess,
		isError: isJoinError,
		isProcessing: isJoinProcessing,
	} = useAgreementJoin();

	/* 
	LISTENER JOIN EVENT
	STEP 3 - JOIN AGREEMENT
	 */
	useEffect(() => {
		if (isJoinSuccess) {
			setIsJoinAgreementFinished(true);
			setStepsLoadingIndex(null);
		} else if (isJoinError) {
			setStepsLoadingIndex(null);
			setStepsError({
				header: "Join Agreement failed",
				description: "Join agreement transaction was not successful. Review and start the process.",
				isError: true,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isJoinSuccess, isJoinError]);

	const steps: IStep[] = [
		{
			title: "Approve NATION",
			description: (
				<div>
					<p className="text-xs mb-1 text-gray-400">Non funds will be used yet.</p>
					<p className="text-md text-gray-500">
						<b>$NATION</b> to be used in case of a dispute.
					</p>
				</div>
			),
			image: "https://picsum.photos/200",
			stepCTA: "Start approval",
			action: () => {
				setStepsLoadingIndex(0);
				approve({ amount: constants.MaxInt256 });
			},
		},
		{
			title: "Sign Approval",
			description: (
				<div>
					<p className="text-xs mb-1 text-gray-400">Non funds will be used yet.</p>
					<p className="text-md text-gray-500">Collateral acquired to join into the agreement.</p>
				</div>
			),
			image: "https://picsum.photos/200",
			stepCTA: "Sign",
			action: () => {
				setStepsLoadingIndex(1);
				signTypedData();
			},
		},
		{
			title: "Join Agreement",
			description: (
				<div>
					<p className="text-md mb-1 text-gray-400">Your funds will be transferred.</p>
					<p className="text-md text-gray-500">
						$NATION and the collateral will be transfered into the agreement. And you will be bound
						by its terms.
					</p>
					<p className="text-xl text-bluesky-200">
						{positions && address && utils.formatUnits(positions[address].balance)} $NATION
					</p>
				</div>
			),
			image: "https://picsum.photos/200",
			stepCTA: "Join agreement",
			action: () => {
				setStepsLoadingIndex(2);
				join({ id, resolver: userResolver, permit, signature });
			},
		},
	];

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, [isAgreementIdCopied]);

	return (
		<>
			{/* 
			//TODO: Build Global UI Context for generic modals and UI Warns
				TERMS HASH MODAL
			*/}
			<Modal show={isTermsModalUp} onClose={() => setIsTermsModalUp(false)}>
				<Modal.Header>{AgreementConstants.termsHash}</Modal.Header>
				<Modal.Body>
					<div className="space-y-6">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							{AgreementConstants.termsDescription}
						</p>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button label="Close" onClick={() => setIsTermsModalUp(false)}></Button>
				</Modal.Footer>
			</Modal>

			{/* 
			//TODO: Build Global UI Context for generic modals and UI Warns
				TX ERROR MODAL
			*/}
			<Modal
				show={stepsError.isError}
				onClose={() => setStepsError({ ...stepsError, isError: false })}
			>
				<Modal.Header>{stepsError.header}</Modal.Header>
				<Modal.Body>
					<div className="space-y-6">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							{stepsError.description}
						</p>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button
						label="Close"
						onClick={() => setStepsError({ ...stepsError, isError: false })}
					></Button>
				</Modal.Footer>
			</Modal>

			<div className="flex flex-col gap-1">
				<Button
					label="Start Join"
					onClick={() => setIsJoinAgreementStarted(!isJoinAgreementStarted)}
				/>

				<Modal
					show={isJoinAgreementStarted}
					onClose={() => setIsJoinAgreementStarted(!isJoinAgreementStarted)}
				>
					<Steps
						steps={steps}
						icon={courtIcon}
						title={"Join Agreement"}
						stepIndex={stepsIndex}
						loadingIndex={stepsLoadingIndex}
						areStepsFinished={isJoinAgreementFinished}
						finishImage="https://picsum.photos/200"
						finishMessage={
							<div className="">
								<p className="font-semibold text-2xl leading-relaxed text-gray-500 dark:text-gray-400">
									Congrats! 💙
								</p>
								<p className="text-base leading-relaxed text-gray-600 dark:text-gray-400">
									{"You've succesfully joined to the agreement"}
								</p>
							</div>
						}
					/>
				</Modal>

				{!enoughBalance && <NotEnoughBalanceAlert />}
			</div>
		</>
	);
};
