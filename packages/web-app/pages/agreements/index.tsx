import React, { useEffect, useState } from "react";
import { ScaleIcon } from "@heroicons/react/24/outline";
import { Card, Table, Button, utils, Badge } from "@nation3/ui-components";
import { useRouter } from "next/router";
import { useSigner } from "wagmi";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

interface Agreement {
    id: string;
    termsHash: string;
    criteria: string;
    status: string;
}

interface AgreementsQueryData {
    agreements: Agreement[];
}

const agreementsQuery = `{
  agreements {
    id
    termsHash
    criteria
    status
  }
}`;

const client = new ApolloClient({
    uri: process.env.GRAPH_API_URL ?? "",
    cache: new InMemoryCache(),
});

const Agreements = () => {
    const router = useRouter();
    const { data: signer } = useSigner();
    const [agreements, setAgreements] = useState<Agreement[]>([]);

    useEffect(() => {
        if (signer) {
            client
                .query<AgreementsQueryData>({ query: gql(agreementsQuery) })
                .then(({ data }) => {
                    const agreements_: Agreement[] = [];

                    console.log("Agreements data", data);
                    data.agreements?.map((agreement) => {
                        if (!agreements_.includes(agreement)) agreements_.push(agreement);
                    });
                    if (agreements_ != agreements) {
                        setAgreements(agreements_);
                    }
                })
                .catch((err) => {
                    console.log("Error while querying", err);
                });
        } else {
            setAgreements([]);
        }
    }, [signer]);

    return (
        <div className="w-full max-w-3xl h-2/3">
            <Card className="flex flex-col w-full h-full items-center items-stretch gap-8 text-gray-800">
                <div className="flex flex-row items-center justify-between gap-2 text-gray-700">
                    <h1 className="font-display font-medium text-2xl">Your Agreements</h1>
                    <div className="basis-1/4">
                        <Button label="Create an agreement" onClick={() => router.push("/agreements/create")} />
                    </div>
                </div>
                {agreements.length > 0 ? (
                    <Table
                        columns={["Id", "Status"]}
                        data={agreements.map(({ id, status }) => [
                            <a key={id} onClick={() => router.push(`/agreements/${id}`)}>
                                {utils.shortenHash(id)}
                            </a>,
                            <Badge label={status} bgColor="slate-300" />,
                        ])}
                        clickHandlers={agreements.map(
                            ({ id }) =>
                                () =>
                                    router.push(`/agreements/${id}`),
                        )}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="flex flex-row items-center justify-center gap-1 max-w-md h-min">
                            <ScaleIcon className="w-64 text-slate-500" strokeWidth="1" />
                            <div>
                                <p className="text-justify">
                                    Nation3 has its own system of law, enforced by its own court and secured by
                                    economic incentives.
                                </p>
                                <a className="font-semibold bg-gradient-to-r from-bluesky to-greensea bg-clip-text text-transparent">
                                    Learn more →
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
};

export default Agreements;
