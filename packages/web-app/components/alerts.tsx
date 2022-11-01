import { CheckCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { Alert, InfoAlert } from "@nation3/ui-components";

export const AgreementFinalizedAlert = () => {
	return (
		<Alert
			icon={<CheckCircleIcon className="w-5 h-5" />}
			message="This agreement has been finalized by all the joined parties."
			color="greensea-200"
			className="bg-opacity-20 text-greensea-700"
		/>
	);
};

export const AgreementDisputedAlert = () => {
	return (
		<Alert
			icon={<CheckCircleIcon className="w-5 h-5" />}
			message="This agreement has been disputed and will be arbitrated by the court."
			color="purple-200"
			className="bg-opacity-20 text-purple-700"
		/>
	);
};

export const TermsVerificationAlert = () => {
	return (
		<InfoAlert message="Verify the terms hash before joining and remember to keep the terms file safe. The terms file will be used as evidence in the case of a dispute." />
	);
};

export const NotEnoughBalanceAlert = () => {
	return (
		<Alert
			icon={<ExclamationTriangleIcon className="w-5 h-5" />}
			color="yellow-200"
			className="bg-opacity-20 text-yellow-500"
			message="You don't have enough balance to join"
		/>
	);
};

export const NotEnoughAllowanceAlert = () => {
	return (
		<Alert
			icon={<ExclamationTriangleIcon className="w-5 h-5" />}
			color="yellow-200"
			className="bg-opacity-20 text-yellow-500"
			message="You don't have enough tokens approved to join"
		>
			{/*
        <div className="px-3">
            <Badge
                label="Approve now"
                textColor="yellow-50"
                bgColor="yellow-500"
                className="hover:cursor-pointer"
                onClick={() =>
                    approveAgreementToken({ amount: requiredBalance ?? BigNumber.from("0") })
                }
            />
        </div>
        */}
		</Alert>
	);
};
