import { assert } from "matchstick-as/assembly/index"
import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  AgreementCreated,
  AgreementFinalizationSent,
  AgreementFinalized,
  AgreementJoined,
  AgreementWithdrawn
} from "../generated/AgreementFramework/AgreementFramework"

export function createAgreementCreatedEvent(
  id: BigInt,
  termsHash: Bytes,
  criteria: BigInt
): AgreementCreated {
  let agreementCreatedEvent = changetype<AgreementCreated>(newMockEvent())

  agreementCreatedEvent.parameters = new Array()

  agreementCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  agreementCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "termsHash",
      ethereum.Value.fromFixedBytes(termsHash)
    )
  )
  agreementCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "criteria",
      ethereum.Value.fromUnsignedBigInt(criteria)
    )
  )

  return agreementCreatedEvent
}

export function createAgreementFinalizationSentEvent(
  id: BigInt,
  party: Address
): AgreementFinalizationSent {
  let agreementFinalizationSentEvent = changetype<AgreementFinalizationSent>(
    newMockEvent()
  )

  agreementFinalizationSentEvent.parameters = new Array()

  agreementFinalizationSentEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  agreementFinalizationSentEvent.parameters.push(
    new ethereum.EventParam("party", ethereum.Value.fromAddress(party))
  )

  return agreementFinalizationSentEvent
}

export function createAgreementFinalizedEvent(id: BigInt): AgreementFinalized {
  let agreementFinalizedEvent = changetype<AgreementFinalized>(newMockEvent())

  agreementFinalizedEvent.parameters = new Array()

  agreementFinalizedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )

  return agreementFinalizedEvent
}

export function createAgreementJoinedEvent(
  id: BigInt,
  party: Address,
  balance: BigInt
): AgreementJoined {
  let agreementJoinedEvent = changetype<AgreementJoined>(newMockEvent())

  agreementJoinedEvent.parameters = new Array()

  agreementJoinedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  agreementJoinedEvent.parameters.push(
    new ethereum.EventParam("party", ethereum.Value.fromAddress(party))
  )
  agreementJoinedEvent.parameters.push(
    new ethereum.EventParam(
      "balance",
      ethereum.Value.fromUnsignedBigInt(balance)
    )
  )

  return agreementJoinedEvent
}

export function createAgreementWithdrawnEvent(
  id: BigInt,
  party: Address,
  balance: BigInt
): AgreementWithdrawn {
  let agreementWithdrawnEvent = changetype<AgreementWithdrawn>(newMockEvent())

  agreementWithdrawnEvent.parameters = new Array()

  agreementWithdrawnEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  agreementWithdrawnEvent.parameters.push(
    new ethereum.EventParam("party", ethereum.Value.fromAddress(party))
  )
  agreementWithdrawnEvent.parameters.push(
    new ethereum.EventParam(
      "balance",
      ethereum.Value.fromUnsignedBigInt(balance)
    )
  )

  return agreementWithdrawnEvent
}

export function assertAgreement(
  id: String, 
  termsHash: String, 
  criteria: String, 
  positions: String, 
  status: String
) : void {
  assert.fieldEquals("Agreement", id, "status", status)
  assert.fieldEquals("Agreement", id, "termsHash", termsHash)
  assert.fieldEquals("Agreement", id, "criteria", criteria)
  assert.fieldEquals("Agreement", id, "positions", positions)
}

export function assertAgreementPosition(
  id: String, 
  party: String, 
  balance: String, 
  status: String, 
  agreement: String
) : void {
  assert.fieldEquals("AgreementPosition", id, "party", party)
  assert.fieldEquals("AgreementPosition", id, "balance", balance)
  assert.fieldEquals("AgreementPosition", id, "status", status)
  assert.fieldEquals("AgreementPosition", id, "agreement", agreement)
}