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

const ADDRESS_SAMPLE_1 = "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7";
const ADDRESS_SAMPLE_2 = "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8";

const AGREEMENT_CREATED_EVENT_SAMPLE_1 = createAgreementCreatedEvent(
  Bytes.fromI32(200),
  Bytes.fromI32(1234567890),
  BigInt.fromI32(1000),
  "Metadata"
);

const AGREEMENT_CREATED_EVENT_SAMPLE_2 = createAgreementCreatedEvent(
  Bytes.fromI32(201),
  Bytes.fromI32(1234567890),
  BigInt.fromI32(1100),
  "Metadata"
);

const AGREEMENT_JOINED_EVENT_SAMPLE_1 = createAgreementJoinedEvent(
  Bytes.fromI32(200),
  Address.fromString(ADDRESS_SAMPLE_1),
  BigInt.fromI32(1050)
);

const AGREEMENT_JOINED_EVENT_SAMPLE_2 = createAgreementJoinedEvent(
  Bytes.fromI32(200),
  Address.fromString(ADDRESS_SAMPLE_2),
  BigInt.fromI32(1090)
);

describe("handling of AgreementCreated", () => {
  afterEach(() => {
    clearStore();
  });

  test("1 AgreementCreated event", () => {
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    assert.entityCount("Agreement", 1);
    assertAgreement("0xc8000000","0xd2029649","1000","[]","Created","Metadata");
  });

  test("2 AgreementCreated event", () => {
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_2);

    assert.entityCount("Agreement", 2);
    assertAgreement("0xc8000000","0xd2029649","1000","[]","Created","Metadata");
    assertAgreement("0xc9000000","0xd2029649","1100","[]","Created","Metadata");
  });
});

describe("handling of AgreementJoined", () => {

  describe("1 Agreement", () => {
    afterEach(() => {
      clearStore();
    });

    beforeEach(() => {
      handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    });    

    test("1 AgreementJoined event", () => {
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
      assert.entityCount("Agreement", 1);
      assert.entityCount("AgreementPosition", 1);
      assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]","Created","Metadata");
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Idle", "0xc8000000")
    });

    test("2 AgreementJoined event", () => {
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_2);
      assert.entityCount("Agreement", 1);
      assert.entityCount("AgreementPosition", 2);
      assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]","Ongoing","Metadata");
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Idle", "0xc8000000")
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", ADDRESS_SAMPLE_2, "1090", "Idle", "0xc8000000")
    });
  });
});