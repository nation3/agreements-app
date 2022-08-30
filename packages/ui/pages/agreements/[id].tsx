import { Card } from "@nation3/components";
import { useRouter } from "next/router";
import React from "react";

export default function AgreementDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <Card>
        {/* Title and details */}
        <div className="text-gray-700">
          <h1 className="font-display font-medium text-2xl">
            Meta Guild rewards multisig
          </h1>
          <span>Created on</span>
        </div>
      </Card>
    </div>
  );
}
