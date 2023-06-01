// import { useEffect, useMemo } from 'react';
export { AgreementListProvider } from "./context/AgreementListProvider";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { BodyHeadline, Body2, Body3, Button, Breadcrumbs, utils } from "@nation3/ui-components";

import { useAgreementList } from "./context/AgreementListContext";
import { useTranslation } from "next-i18next";
import { AgreementCardCompact } from "../agreement/AgreementCard";
import React from "react";

export const AgreementList = () => {
	const { t } = useTranslation("common");
	const { agreements } = useAgreementList();
	const router = useRouter();

	if (agreements.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-full">
				<Image src="/svgs/fading-agreements.svg" alt="Fading agreements" width={300} height={300} />
				<BodyHeadline>No agreements yet</BodyHeadline>
				<Body2
					color={"neutral-c-600"}
					className="flex flex-col items-center justify-center text-center"
				>
					<p>There is no agreement created yet</p>
					<p>
						You can create your first one <br className="md:hidden" />
						in less than 1 minute
					</p>
				</Body2>
				<Button
					className="mt-4"
					label="New Agreement"
					onClick={() => router.push("/agreement/create")}
				/>
			</div>
		);
	}

	// FIXME: Get real terms file data from query
	return (
		<>
			<div className="mb-[16px]">
				<div className="flex w-fit py-[12px] border-b-2 border-pr-c-green3">
					<Body3 className="sm-only:text-xs">All ({agreements.length})</Body3>
				</div>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
				{agreements.map(({ id, title, status, termsHash }) => {
					return (
						<Link key={id} href={`/agreement/${id}`}>
							<AgreementCardCompact
								title={title || `Agreement #${utils.shortenHash(id)}`}
								status={status}
								fileName=""
								termsHash={termsHash}
								fileStatus="Private"
								token={{ name: "Nation", symbol: "NATION", address: "0x00000000", decimals: 18 }}
							/>
						</Link>
					);
				})}
			</div>
		</>
	);
};
