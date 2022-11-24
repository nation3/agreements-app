import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, Address } from "@graphprotocol/graph-ts"
import {
  ResolutionAppealed,
  ResolutionEndorsed,
  ResolutionExecuted,
  ResolutionSubmitted,
} from "../generated/Arbitrator/Arbitrator"

export function createResolutionAppealedEvent(
  hash: Bytes,
  account: Address
): ResolutionAppealed {
  let resolutionAppealedEvent = changetype<ResolutionAppealed>(newMockEvent())

  resolutionAppealedEvent.parameters = new Array()

  resolutionAppealedEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )
  resolutionAppealedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )

  return resolutionAppealedEvent
}

export function createResolutionEndorsedEvent(hash: Bytes): ResolutionEndorsed {
  let resolutionEndorsedEvent = changetype<ResolutionEndorsed>(newMockEvent())

  resolutionEndorsedEvent.parameters = new Array()

  resolutionEndorsedEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )

  return resolutionEndorsedEvent
}

export function createResolutionExecutedEvent(hash: Bytes): ResolutionExecuted {
  let resolutionExecutedEvent = changetype<ResolutionExecuted>(newMockEvent())

  resolutionExecutedEvent.parameters = new Array()

  resolutionExecutedEvent.parameters.push(
    new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )

  return resolutionExecutedEvent
}

export function createResolutionSubmittedEvent(
  framework: Address,
  id: Bytes,
  hash: Bytes
): ResolutionSubmitted {
  let resolutionSubmittedEvent = changetype<ResolutionSubmitted>(newMockEvent())

  resolutionSubmittedEvent.parameters = new Array()

  resolutionSubmittedEvent.parameters.push(
    new ethereum.EventParam("framework", ethereum.Value.fromAddress(framework))
  )
  resolutionSubmittedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromFixedBytes(id))
  )
  resolutionSubmittedEvent.parameters.push(
      new ethereum.EventParam("hash", ethereum.Value.fromFixedBytes(hash))
  )

  return resolutionSubmittedEvent
}
