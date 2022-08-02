import { BigInt } from "@graphprotocol/graph-ts"
import {
  AgreementCreated,
  AgreementFinalizationSent,
  AgreementFinalized,
  AgreementJoined,
  AgreementWithdrawn
} from "../generated/AgreementFramework/AgreementFramework"
import { Agreement, AgreementPosition } from "../generated/schema"

export function handleAgreementCreated(event: AgreementCreated): void {
  let agreement = new Agreement(event.params.id.toHex())
  agreement.termsHash = event.params.termsHash
  agreement.criteria = event.params.criteria
  agreement.save()
}

export function handleAgreementFinalizationSent(event: AgreementFinalizationSent): void {
}

export function handleAgreementFinalized(event: AgreementFinalized): void {}

export function handleAgreementJoined(event: AgreementJoined): void {}

export function handleAgreementWithdrawn(event: AgreementWithdrawn): void {}
