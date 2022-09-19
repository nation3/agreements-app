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

	return <div>...</div>;
};

export default Home;
