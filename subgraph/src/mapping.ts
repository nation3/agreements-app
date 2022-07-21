import { AgreementCreated, AgreementJoined } from '../generated/CollateralAgreementFramework/CollateralAgreementFramework'
import { Agreement, AgreementPosition } from '../generated/schema'

export function handleAgreementCreated(event: AgreementCreated): void {
  let agreement = new Agreement(event.params.id.toHex())
  agreement.termsHash = event.params.termsHash
  agreement.criteria = event.params.criteria.toString()
  agreement.save()
}

export function handleAgreementJoined(event: AgreementJoined): void {
  let id = event.params.id.toHex()
  let agreement = Agreement.load(id)
  if (agreement == null) {
    agreement = new Agreement(id)
  }
  let position = new AgreementPosition(id)
  position.agreement = agreement.id
  position.holder = event.params.party.toHex()
  position.balance = event.params.balance
  position.status = "IDLE"
}
