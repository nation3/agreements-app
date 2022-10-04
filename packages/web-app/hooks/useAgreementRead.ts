import { abi } from "../abis/IAgreementFramework.json";
import { Contract, ContractInterface, BigNumber, Signer, providers, ethers } from "ethers";
import { useMemo} from "react";


export type useAgreementReadConfig = {
    address: string,
    signerOrProvider?: Signer | providers.Provider | null
}

export function useAgreementRead({
    address,
    signerOrProvider
}: useAgreementReadConfig) {
    const contract = useMemo(
        () => new Contract(address, abi, signerOrProvider),
        [address, signerOrProvider]
    );

    const getAgreementParams = async (
        agreementId: string
    ) => {
        return await contract.getAgreementParams(agreementId);
    };

    const getAgreementPositions = async (
        agreementId: string
    ) => {
        return await contract.getAgreementPositions(agreementId);
    };

    return { getAgreementParams, getAgreementPositions };
}
