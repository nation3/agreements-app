import { assert } from "matchstick-as/assembly/index";
import { newMockEvent } from "matchstick-as";
import { ethereum, BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import {
  AgreementCreated,
  AgreementJoined,
  AgreementPositionUpdated,
  AgreementFinalized,
  AgreementDisputed,
} from "../generated/AgreementFramework/AgreementFramework";

export function createAgreementCreatedEvent(
  id: Bytes,
  termsHash: Bytes,
  criteria: BigInt,
  metadataURI: String
): AgreementCreated {
  let agreementCreatedEvent = changetype<AgreementCreated>(newMockEvent());

  agreementCreatedEvent.parameters = new Array();

  agreementCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  );
  agreementCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "termsHash",
      ethereum.Value.fromFixedBytes(termsHash)
    )
  );
  agreementCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "criteria",
      ethereum.Value.fromUnsignedBigInt(criteria)
    )
  );
  agreementCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "metadataURI",
      ethereum.Value.fromString(metadataURI)
    )
  );

  return agreementCreatedEvent;
}

export function createAgreementFinalizedEvent(id: BigInt): AgreementFinalized {
  let agreementFinalizedEvent = changetype<AgreementFinalized>(newMockEvent());

  agreementFinalizedEvent.parameters = new Array();

  agreementFinalizedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  );

  return agreementFinalizedEvent;
}

export function createAgreementJoinedEvent(
  id: BigInt,
  party: Address,
  balance: BigInt
): AgreementJoined {
  let agreementJoinedEvent = changetype<AgreementJoined>(newMockEvent());

  agreementJoinedEvent.parameters = new Array();

  agreementJoinedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  );
  agreementJoinedEvent.parameters.push(
    new ethereum.EventParam("party", ethereum.Value.fromAddress(party))
  );
  agreementJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "balance",
      ethereum.Value.fromUnsignedBigInt(balance)
    )
  );

  return agreementJoinedEvent;
}

export function createAgreementDisputedEvent(
  id: BigInt,
  party: Address
): AgreementDisputed {
  let agreementDisputedEvent = changetype<AgreementDisputed>(newMockEvent());

  agreementDisputedEvent.parameters = new Array();

  agreementDisputedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  );
  agreementDisputedEvent.parameters.push(
    new ethereum.EventParam("party", ethereum.Value.fromAddress(party))
  );

  return agreementDisputedEvent;
}

export function createAgreementPositionUpdatedEvent(
  id: BigInt,
  party: Address,
  balance: BigInt,
  status: BigInt
): AgreementPositionUpdated {
  let agreementPositionUpdatedEvent = changetype<AgreementPositionUpdated>(
    newMockEvent()
  );

  agreementPositionUpdatedEvent.parameters = new Array();

  agreementPositionUpdatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  );
  agreementPositionUpdatedEvent.parameters.push(
    new ethereum.EventParam("party", ethereum.Value.fromAddress(party))
  );
  agreementPositionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "balance",
      ethereum.Value.fromUnsignedBigInt(balance)
    )
  );
  agreementPositionUpdatedEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromUnsignedBigInt(status))
  );

  return agreementPositionUpdatedEvent;
}

export function assertAgreement(
  id: String,
  termsHash: String,
  criteria: String,
  positions: String,
  status: String,
  metadataURI: String
): void {
  assert.fieldEquals("Agreement", id, "status", status);
  assert.fieldEquals("Agreement", id, "termsHash", termsHash);
  assert.fieldEquals("Agreement", id, "criteria", criteria);
  assert.fieldEquals("Agreement", id, "positions", positions);
  assert.fieldEquals("Agreement", id, "metadataURI", metadataURI);
}

export function assertAgreementPosition(
  id: String,
  party: String,
  balance: String,
  status: String,
  agreement: String
): void {
  assert.fieldEquals("AgreementPosition", id, "party", party);
  assert.fieldEquals("AgreementPosition", id, "balance", balance);
  assert.fieldEquals("AgreementPosition", id, "status", status);
  assert.fieldEquals("AgreementPosition", id, "agreement", agreement);
}
