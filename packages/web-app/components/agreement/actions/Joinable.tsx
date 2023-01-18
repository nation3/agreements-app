import { useMemo, useState, useCallback, useEffect } from "react";
import { useAccount, useSignTypedData } from "wagmi";
import { BigNumber, constants } from "ethers";
import { Button } from "@nation3/ui-components/";
import { Modal } from "flowbite-react";
import { NotEnoughBalanceAlert } from "../../alerts";
import { useToken } from "../../../hooks/useToken";
import { useAgreementJoin } from "../../../hooks/useAgreement";
import { frameworkAddress, NATION, permit2Address } from "../../../lib/constants";
import { UserPosition } from "../context/types";
import { AgreementConstants } from "../AgreementConstants";

import { SignatureTransfer, PermitBatchTransferFrom } from "@uniswap/permit2-sdk";

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

	const {
		balance: accountTokenBalance,
		// allowance: accountTokenAllowance,
		approve,
		approvalLoading,
		approvalProcessing,
	} = useToken({
		address: NATION,
		account: address || constants.AddressZero,
		spender: permit2Address,
		enabled: typeof address !== "undefined",
	});

	const userResolver = useMemo(
		() => ({
			account: address || constants.AddressZero,
			balance: userPosition.resolver?.balance || "0",
			proof: userPosition.resolver?.proof || [],
		}),
		[address, userPosition],
	);

	const { join, isLoading: joinLoading, isProcessing: joinProcessing } = useAgreementJoin();

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

	/*
    const enoughAllowance = useMemo(() => {
        if (accountTokenAllowance) {
            return requiredBalance.lte(BigNumber.from(accountTokenAllowance));
        } else {
            return true;
        }
    }, [accountTokenAllowance, requiredBalance]);
    */

	// const steps = [{}];

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

	const { data: signature, signTypedData } = useSignTypedData(signTypedDataConfig);

	/*
    const copyAgreementId = useCallback(() => {
        if (id) {
            setIsAgreementIdCopied(true);
            navigator.clipboard.writeText(window.location.href);
            setTimeout(() => setIsAgreementIdCopied(false), 1000);
        }
    }, [id]);
    */

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	useEffect(() => {}, [isAgreementIdCopied]);

	return (
		<>
			{/*  */}
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
			<div className="flex flex-col gap-1">
				<Button
					label="Approve"
					disabled={approvalLoading || approvalProcessing}
					isLoading={approvalLoading || approvalProcessing}
					onClick={() => approve({ amount: constants.MaxInt256 })}
				/>
				<Button label="Sign" onClick={() => signTypedData()} />
				<Button
					label="Join"
					disabled={joinLoading || joinProcessing || !enoughBalance}
					isLoading={joinLoading || joinProcessing}
					onClick={() => join({ id, resolver: userResolver, permit, signature })}
				/>
				{/*!enoughAllowance ? (
					<Button
						label="Approve"
						disabled={approvalLoading || approvalProcessing}
						isLoading={approvalLoading || approvalProcessing}
						onClick={() => approve({ amount: requiredBalance })}
					/>
				) : (
					<div className="inline-grid gap-2 grid-cols-2">
						<Button
							outlined
							label={isAgreementIdCopied ? "Copied" : "Share"}
							disabled={joinLoading || joinProcessing || !enoughBalance || !enoughAllowance}
							onClick={() => copyAgreementId()}
						/>
						<Button
							label="Join"
							disabled={joinLoading || joinProcessing || !enoughBalance || !enoughAllowance}
							isLoading={joinLoading || joinProcessing}
							onClick={() => join({ id, resolver: userResolver })}
						/>
					</div>
				)*/}
				{/* 
TODO: 
{
				<Modal open={isJoinAgreementStarted}>
					<Steps steps={steps} icon={""} title={""} stepIndex={0} loadingIndex={null} />
				</Modal>
			} */}
				{!enoughBalance && <NotEnoughBalanceAlert />}
			</div>
		</>
	);
};
