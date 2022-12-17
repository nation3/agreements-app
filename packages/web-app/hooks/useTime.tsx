import { useState, useEffect } from "react";
import { useBlockNumber } from "wagmi";

const BLOCK_MINING_TIME = 12; // seconds

export const secondsBetweenBlocks = (currentBlock: number, targetBlock: number) => {
	return (targetBlock - currentBlock) * BLOCK_MINING_TIME;
};

export const useTimeToBlock = (targetBlock: number) => {
	const [timeLeft, setTimeLeft] = useState(0);
	const { data: currentBlock } = useBlockNumber();

	useEffect(() => {
		if (typeof currentBlock == "undefined" || !targetBlock) return;
		const delta = secondsBetweenBlocks(currentBlock, targetBlock);
		setTimeLeft(() => (delta > 0 ? delta : 0));
	}, [targetBlock, currentBlock]);

	return { time: timeLeft };
};
