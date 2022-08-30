import { ChevronLeftIcon } from "@heroicons/react/outline";
import { Badge, Button, Card, InfoAlert, Table } from "@nation3/components";
import { useRouter } from "next/router";
import React from "react";

export default function AgreementDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const agreement = {
    id: "123456789",
    created: "30/04/2022",
    hash: "123456789",
    title: "Meta Guild rewards multisig",
    participants: ["test.eth", "greg.eth", "0xgallego.eth"],
    stakes: [10, 4, 5],
    status: ["Signed finalization", "Hasn't joined", "Hasn't joined"],
  };

  return (
    <div>
      <div className="flex items-center gap-1 py-1 text-n3blue cursor-pointer hover:underline">
        <ChevronLeftIcon className="w-4 h-4" /> Back to your agreements
      </div>
      <Card className="flex flex-col gap-8 max-w-2xl text-gray-800">
        {/* Title and details */}
        <div className="text-gray-700">
          <h1 className="font-display font-medium text-2xl">
            {agreement.title}
          </h1>
          <span>
            Created on {agreement.created} | ID {id} | Terms hash{" "}
            {agreement.hash}
          </span>
        </div>
        {/* Participant table */}
        <Table
          columns={["participant", "stake", "status"]}
          data={agreement.participants.map((participant, index) => [
            participant,
            <b>{agreement.stakes[index]} $NATION</b>,
            <Badge
              textColor="yellow-800"
              bgColor="yellow-100"
              text={agreement.status[index]}
            />,
          ])}
        />
        {/* Info */}
        <InfoAlert message="If you are one of the parties involved in this agreement, please keep the terms file safe. You will need it to interact with this app." />
        {/* Action buttons */}
        <div className="flex gap-8 justify-between">
          <Button label="Validate terms" />
          <Button label="Join" />
        </div>
      </Card>
    </div>
  );
}
