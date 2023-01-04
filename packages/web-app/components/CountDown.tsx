import { useState, useEffect } from "react";

// Seoncds constants
const MINUTE = 60;
const HOUR = 3600;
const DAY = 86400;

export const formatTime = (time: number) => {
	const days = Math.floor(time / DAY);
	const hours = Math.floor((time % DAY) / HOUR);
	const minutes = Math.floor((time % HOUR) / MINUTE);
	const seconds = Math.floor(time % MINUTE);

	return { days, hours, minutes, seconds };
};

export const formatTimeString = (time: number) => {
	const { days, hours, minutes } = formatTime(time);
	return `${days}d:${hours}h:${minutes}m`;
};

export const CountDown = ({ seconds }: { seconds: number }) => {
	const [countDown, setCountDown] = useState(seconds);
	const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();

	useEffect(() => {
		setCountDown(seconds);
		const interval = setInterval(() => {
			setCountDown((prevCountDown) => prevCountDown - 1);
		}, 1000);
		setTimer(interval);

		return () => clearInterval(interval);
	}, [seconds]);

	useEffect(() => {
		if (countDown < 1) {
			clearInterval(timer);
		}
	}, [timer, countDown]);

	return <span>{formatTimeString(countDown)}</span>;
};
