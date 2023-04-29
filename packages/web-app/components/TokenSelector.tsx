import { BodyHeadline, Button, ButtonBase, ModalNew } from "@nation3/ui-components";
import Image from "next/image";
import { FC, useState } from "react";
import { useTokenList } from "../hooks/useTokenList";
import { Token } from "./agreement/context/types";

interface TokenSelectorProps {
	onTokenSelect: (token: Token) => void;
}

export const TokenSelector: FC<TokenSelectorProps> = ({ onTokenSelect }) => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const tokens = useTokenList();

	const handleOpen = () => {
		setIsOpen(true);
	};

	const handleClose = () => {
		setIsOpen(false);
	};

	return (
		<>
			<Button label="Select token" onClick={handleOpen} />
			<ModalNew isOpen={isOpen} onClose={handleClose}>
				<div className="h-auto bg-white rounded-lg p-8 w-full max-w-full mx-auto md:max-w-2xl shadow-md overflow-scroll border-2 border-neutral-c-200">
					<BodyHeadline className="mb-base">{"Select the collateral token"}</BodyHeadline>
					<div className="flex flex-col gap-2">
						{tokens.map((token) => {
							return (
								<ButtonBase
									key={token.address}
									className={
										"p-2 gap-1 border-2 font-semibold hover:bg-slate-50 transition-colors hover:border-bluesky-200"
									}
									onClick={() => {
										onTokenSelect(token);
										handleClose();
									}}
								>
									<div className="flex items-center ">
										{token && token.icon && (
											<Image height={25} width={25} alt={token.name} src={token.icon} />
										)}
										<p className="ml-2">{token.name}</p>
									</div>
								</ButtonBase>
							);
						})}
					</div>
				</div>
			</ModalNew>
		</>
	);
};
