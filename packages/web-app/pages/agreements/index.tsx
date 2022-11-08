import { Card, Button } from "@nation3/ui-components";
import { useRouter } from "next/router";
import { AgreementList, AgreementListProvider } from "../../components/list";

const Agreements = () => {
	const router = useRouter();

	return (
		<div id="agreementsPage" className="w-full max-w-3xl h-2/3">
			<AgreementListProvider>
				<Card className="flex flex-col w-full h-full items-center items-stretch gap-8 text-gray-800">
					<div className="flex flex-row items-center justify-between gap-2 text-gray-700">
						<h1 className="font-display font-medium text-2xl">Your Agreements</h1>
						<div className="flex gap-2 basis-1/3">
							<Button label="Create" onClick={() => router.push("/agreements/create")} />
						</div>
					</div>
					<AgreementList />
				</Card>
			</AgreementListProvider>
		</div>
	);
};

export default Agreements;
