import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
	const router = useRouter();

	useEffect(() => {
		if (router.pathname == "/") {
			router.push("/agreements");
		}
	});

	return (
		<div className="flex min-h-screen flex-col items-center justify-center py-2">
			<main className="flex w-full flex-1 flex-col items-center justify-center px-20 text-center">
				<div>...</div>
			</main>
		</div>
	);
};

export default Home;
