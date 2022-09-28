import { useContractWrite } from "wagmi";
import contractInterface from "../abis/IAgreementFramework.json";

const abi = contractInterface.abi;
const contractAddress = "0xb47262C22280f361ad47Af0636086463Bd29A109";

export const useAgreementCreate = ({ onSettledSuccess }: { onSettledSuccess: () => void }) => {
	return useContractWrite({
		mode: "recklesslyUnprepared",
		addressOrName: contractAddress,
		contractInterface: abi,
		functionName: "createAgreement",
		onSettled(data, error) {
			if (data) {
				onSettledSuccess();
			} else {
				console.log(error);
			}
		},
	});
};
