import { BigInt } from "@graphprotocol/graph-ts";
import {
  AgreementCreated,
  AgreementFinalized,
  AgreementJoined,
  AgreementPositionUpdated,
  AgreementDisputed,
} from "../generated/AgreementFramework/AgreementFramework";
import { Agreement, AgreementPosition } from "../generated/schema";

export function handleAgreementCreated(event: AgreementCreated): void {
  let agreement = new Agreement(event.params.id.toHexString());
  agreement.termsHash = event.params.termsHash;
  agreement.criteria = event.params.criteria;
  agreement.status = "Created";
  agreement.metadataURI = event.params.metadataURI;
  agreement.save();
}

export function handleAgreementFinalized(event: AgreementFinalized): void {
  let agreement = Agreement.load(event.params.id.toHexString());
  if (agreement) {
    agreement.status = "Finalized";
    agreement.save();
  }
}

export function handleAgreementJoined(event: AgreementJoined): void {
  let agreement = Agreement.load(event.params.id.toHexString());
  let position = new AgreementPosition(
    event.params.id.toHexString().concat(event.params.party.toHexString())
  );

  if (position) {
    position.party = event.params.party;
    position.balance = event.params.balance;
    position.status = "Idle";
    position.agreement = event.params.id.toHexString();
    position.save();
  }

  if (agreement) {
    if (agreement.positions && agreement.positions!.length >= 1) {
      agreement.status = "Ongoing";
    }
    agreement.save();
  }
}

export function handleAgreementPositionUpdated(
  event: AgreementPositionUpdated
): void {
  let agreement = Agreement.load(event.params.id.toHexString());
  let position = AgreementPosition.load(
    event.params.id.toHexString().concat(event.params.party.toHexString())
  );
  if (position !== null) {
    position.balance = event.params.balance;
    if (event.params.status == 0) position.status = "Idle";
    else position.status = "Finalized";
    position.save();
  }
}

export function handleAgreementDisputed(event: AgreementDisputed): void {
  let agreement = Agreement.load(event.params.id.toHexString());
  if (agreement) {
    agreement.status = "Disputed";
    agreement.save();
  }
}
