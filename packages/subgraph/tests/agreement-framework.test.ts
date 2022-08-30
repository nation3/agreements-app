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

const AGREEMENT_CREATED_EVENT_SAMPLE_1 = createAgreementCreatedEvent(
  Bytes.fromI32(200),
  Bytes.fromI32(1234567890),
  BigInt.fromI32(1000),
  "metadata"
);

const AGREEMENT_CREATED_EVENT_SAMPLE_2 = createAgreementCreatedEvent(
  Bytes.fromI32(201),
  Bytes.fromI32(1234567890),
  BigInt.fromI32(1100),
  "metadata"
);

describe("handling of AgreementCreated", () => {
  afterEach(() => {
    clearStore();
  });

  test("1 AgreementCreated event", () => {
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    assert.entityCount("Agreement", 1);
    assertAgreement("0xc8000000","0xd2029649","1000","[]","Created","metadata");
  });

  test("2 AgreementCreated event", () => {
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_2);

    assert.entityCount("Agreement", 2);
    assertAgreement("0xc8000000","0xd2029649","1000","[]","Created","metadata");
    assertAgreement("0xc9000000","0xd2029649","1100","[]","Created","metadata");
  });
});