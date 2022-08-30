import {
  assert,
  describe,
  test,
  clearStore,
  afterEach,
  beforeEach,
} from "matchstick-as/assembly/index";
import { logStore } from "matchstick-as/assembly/store";
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
import { Agreement } from "../generated/schema";
import { AgreementCreated } from "../generated/AgreementFramework/AgreementFramework";
import {
  handleAgreementCreated,
  handleAgreementJoined,
  handleAgreementPositionUpdated,
  handleAgreementFinalized,
  handleAgreementDisputed,
} from "../src/agreement-framework";
import {
  createAgreementCreatedEvent,
  createAgreementDisputedEvent,
  createAgreementJoinedEvent,
  createAgreementPositionUpdatedEvent,
  createAgreementFinalizedEvent,
  assertAgreement,
  assertAgreementPosition,
} from "./agreement-framework-utils";

describe("handling of AgreementCreated", () => {
  afterEach(() => {
    clearStore();
  });

  beforeEach(() => {
    let newAgreementCreatedEvent = createAgreementCreatedEvent(
      Bytes.fromI32(200),
      Bytes.fromI32(1234567890),
      BigInt.fromI32(1000),
      "metadata"
    );
    handleAgreementCreated(newAgreementCreatedEvent);
  });

  test("1 AgreementCreated event", () => {
    assert.entityCount("Agreement", 1);
    assertAgreement(
      "0xc8000000",
      "0xd2029649",
      "1000",
      "[]",
      "Created",
      "metadata"
    );
  });

  test("2 AgreementCreated event", () => {
    let newAgreementCreatedEvent = createAgreementCreatedEvent(
      Bytes.fromI32(201),
      Bytes.fromI32(1234567890),
      BigInt.fromI32(1100),
      "metadata"
    );
    handleAgreementCreated(newAgreementCreatedEvent);

    assert.entityCount("Agreement", 2);

    assertAgreement(
      "0xc8000000",
      "0xd2029649",
      "1000",
      "[]",
      "Created",
      "metadata"
    );
    assertAgreement(
      "0xc9000000",
      "0xd2029649",
      "1100",
      "[]",
      "Created",
      "metadata"
    );
  });
});
