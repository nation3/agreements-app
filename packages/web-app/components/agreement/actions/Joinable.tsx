import { useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import { BigNumber, constants, utils } from "ethers";
// import { useTokenBalance } from "../../../hooks/useToken";
import { useAgreementJoin } from "../../../hooks/useAgreement";
import { frameworkAddress, NATION } from "../../../lib/constants";
import { UserPosition } from "../context/types";
import { AgreementConstants } from "../AgreementConstants";
import { FancyLink } from "../../FancyLink";
import Image from "next/image";
import { Button, Steps, IStep } from "@nation3/ui-components";
import { Modal as FlowModal } from "flowbite-react";
import courtIcon from "../../../assets/svgs/court.svg";
import nationCoinIcon from "../../../assets/svgs/nation_coin.svg";
import joinedIcon from "../../../assets/svgs/joined.svg";
// import joinedSuccessIcon from "../../../assets/svgs/joined_success.svg";
import { usePermit2Allowance, usePermit2BatchTransferSignature } from "../../../hooks/usePermit2";

export const JoinableAgreementActions = ({
	id,
	userPosition,
}: {
	id: string;
	userPosition: UserPosition;
}) => {
	const { address } = useAccount();
	// FIXME: Fetch from agreement framework
	const [requiredDeposit] = useState(0);
	const [isTermsModalUp, setIsTermsModalUp] = useState<boolean>(false);
	const [isJoinAgreementModalOpen, setIsJoinAgreementModalOpen] = useState<boolean>(false);
	const [stepsIndex, setStepsIndex] = useState<number>(0);
	const [stepsLoadingIndex, setStepsLoadingIndex] = useState<number | null>(null);
	const [stepsError, setStepsError] = useState<{
		header: string;
		description: string;
		isError: boolean;
	}>({
		header: "",
		description: "",
		isError: false,
	});

	/* JOIN PRE-REQUIREMENTS */

	const userResolver = useMemo(
		() => ({
			account: address || constants.AddressZero,
			balance: userPosition.resolver?.balance || "0",
			proof: userPosition.resolver?.proof || [],
		}),
		[address, userPosition],
	);

	const requiredCollateral = useMemo((): BigNumber => {
		return BigNumber.from(userPosition.resolver?.balance || 0);
	}, [userPosition]);

	const {
		isEnough: depositTokenApproved,
		approve: approveDepositToken,
		approvalSuccess,
		approvalError,
	} = usePermit2Allowance({
		token: NATION,
		account: address || constants.AddressZero,
	});

	// FIXME: Combine approval for collateral token when != deposit token
	/*
    const {
        isEnough: collateralTokenApproved,
        approve: approveCollateralToken
    } = usePermit2Allowance({
        token: NATION,
        account: address || constants.AddressZero,
    });
    */

	// FIXME: Check also required deposit & add pre-step to acquire those tokens
	/*
    const { balance: depositTokenBalance } = useTokenBalance({
        address: NATION,
        account: address || constants.AddressZero
    });

    const { balance: collateralTokenBalance } = useTokenBalance({
        address: NATION,
        account: address || constants.AddressZero
    });

    const enoughBalance = useMemo((): boolean => {
        if (depositTokenBalance && collateralTokenBalance) {
            return requiredCollateral.lte(BigNumber.from(collateralTokenBalance));
        } else {
            return false;
        }
    }, [depositTokenBalance, collateralTokenBalance, requiredCollateral]);
    */

	useEffect(() => {
		if (approvalSuccess || approvalError) {
			setStepsLoadingIndex(null);
		}
	}, [approvalSuccess, approvalError]);

	/* PERMIT SIGNATURE */

	const { permit, signature, signPermit, signSuccess, signError } =
		usePermit2BatchTransferSignature({
			tokenTransfers: [
				{ token: NATION, amount: requiredDeposit },
				{ token: NATION, amount: requiredCollateral },
			],
			spender: frameworkAddress,
		});

	useEffect(() => {
		// TODO: Built in this logic into the Steps component
		if (signSuccess) {
			setStepsLoadingIndex(null);
		}
	}, [signSuccess, signError]);

	/* LISTENER APPROVAL EVENT */
	/*
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
    */

	/* STEPS 2 - SIGN */

	const { join, isTxSuccess: isJoinSuccess, isError: isJoinError } = useAgreementJoin();

	useEffect(() => {
		if (isJoinSuccess) {
			setStepsLoadingIndex(null);
			window.location.reload();
		} else if (isJoinError) {
			setStepsLoadingIndex(null);
			setStepsError({
				header: "Join Agreement failed",
				description: "Join agreement transaction was not successful. Review and start the process.",
				isError: true,
			});
		}
	}, [isJoinSuccess, isJoinError]);

	// FIXME: Better step index selector
	useEffect(() => {
		const index = depositTokenApproved ? (signature ? 2 : 1) : 0;
		setStepsIndex(index);
		// TODO: Rethink this, array mode steps are definetly not the best.
		/* 		const manageSteps = [...stepsBase];
        Array.from(Array(index).keys()).forEach(() => {
            manageSteps.shift();
        }); */
	}, [depositTokenApproved, signature]);

	const steps: IStep[] = [
		{
			title: "Setup Permit2",
			description: (
				<div>
					<p className="text-xs text-gray-400">
						One-time approval to use Permti2 as the transfer manager for the agreement tokens.
					</p>
					<FancyLink
						href="https://uniswap.org/blog/permit2-and-universal-router"
						caption="Learn more"
					/>
				</div>
			),
			image: nationCoinIcon,
			stepCTA: "Setup Permit2",
			action: () => {
				setStepsLoadingIndex(0);
				approveDepositToken();
			},
		},
		{
			title: "Approve Tokens",
			description: (
				<div>
					<p className="text-xs text-gray-400">
						Sign a permit to transfer the required tokens to join the agreement.
					</p>
					<FancyLink
						href="https://docs.nation3.org/agreements/joining-an-agreement"
						caption="Learn more"
					/>
				</div>
			),
			image: nationCoinIcon,
			stepCTA: "Sign",
			action: () => {
				setStepsLoadingIndex(1);
				signPermit();
			},
		},
		{
			title: "Join Agreement",
			description: (
				<div>
					<p className="text-xs mb-1 text-gray-500">
						The required tokens will be deposited into the agreement and you will be bound by its
						terms.
					</p>
					<p className="text-xs mb-1 text-gray-500">
						<span className="font-semibold text-bluesky-500">{requiredDeposit} $NATION:</span>
						<span className="text-gray-400"> Dispute deposit</span>
					</p>
					<p className="text-xs mb-1 text-gray-500">
						<span className="font-semibold text-bluesky-500">
							{utils.formatUnits(requiredCollateral)} $NATION:
						</span>
						<span className="text-gray-400"> Collateral</span>
					</p>
				</div>
			),
			image: joinedIcon,
			stepCTA: "Join agreement",
			action: () => {
				setStepsLoadingIndex(2);
				join({ id, resolver: userResolver, permit, signature });
			},
		},
	];

	return (
		<>
			{/* 
			//TODO: Build Global UI Context for generic modals and UI Warns
				TERMS HASH MODAL
			*/}
			<FlowModal show={isTermsModalUp} onClose={() => setIsTermsModalUp(false)}>
				<FlowModal.Header>{AgreementConstants.termsHash}</FlowModal.Header>
				<FlowModal.Body>
					<div className="space-y-6">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							{AgreementConstants.termsDescription}
						</p>
					</div>
				</FlowModal.Body>
				<FlowModal.Footer>
					<Button label="Close" onClick={() => setIsTermsModalUp(false)}></Button>
				</FlowModal.Footer>
			</FlowModal>

			{/* 
			//TODO: Build Global UI Context for generic modals and UI Warns
				TX ERROR MODAL
			*/}
			<FlowModal
				show={stepsError.isError}
				onClose={() => setStepsError({ ...stepsError, isError: false })}
			>
				<FlowModal.Header>{stepsError.header}</FlowModal.Header>
				<FlowModal.Body>
					<div className="space-y-6">
						<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
							{stepsError.description}
						</p>
					</div>
				</FlowModal.Body>
				<FlowModal.Footer>
					<Button
						label="Close"
						onClick={() => setStepsError({ ...stepsError, isError: false })}
					></Button>
				</FlowModal.Footer>
			</FlowModal>

			<div className="flex flex-col gap-1">
				<Button label="Join Agreement" onClick={() => setIsJoinAgreementModalOpen(true)} />

				<FlowModal
					show={isJoinAgreementModalOpen}
					onClose={() => setIsJoinAgreementModalOpen(false)}
				>
					<FlowModal.Header>
						<div className="flex items-center w-full pl-3">
							{courtIcon && (
								<div className="overflow-hidden flex items-center justify-center h-1/2 mr-6">
									<Image
										className="h-full"
										width={40}
										height={40}
										src={courtIcon}
										alt={"Join Agreemtent"}
									/>
								</div>
							)}
							<h3 className="text-slate-600 md:text-xl text-xl font-semibold">
								{"Join Agreement"}
							</h3>
						</div>
					</FlowModal.Header>
					<Steps
						steps={steps}
						icon={courtIcon}
						title={"Join Agreement"}
						stepIndex={stepsIndex}
						loadingIndex={stepsLoadingIndex}
					/>
				</FlowModal>
			</div>
		</>
	);
};
