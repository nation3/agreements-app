import { Card, Button } from "@nation3/ui-components";
import { useRouter } from "next/router";
import { AgreementList, AgreementListProvider } from "../../components/agreements-list";
import { ApolloProvider } from "@apollo/client";
import { client } from "../../lib/subgraph";

const Agreements = () => {
	const router = useRouter();

	return (
		<div id="agreementsPage" className="w-full max-w-3xl h-2/3">
			<ApolloProvider client={client}>
				<AgreementListProvider>
					<Card className="flex flex-col w-full items-stretch gap-8 text-gray-800">
						<div className="flex flex-row items-center justify-between gap-2 text-gray-700">
							<h1 className="pl-2 font-display font-medium text-xl md:text-3xl text-slate-600">
								Agreements
							</h1>
							<div className="flex gap-2 md:basis-1/3 basis-2/3">
								<Button label="New Agreement" onClick={() => router.push("/agreements/create")} />
							</div>
						</div>
						<AgreementList />
					</Card>
				</AgreementListProvider>
			</ApolloProvider>
		</div>
	);
};

export default Agreements;
