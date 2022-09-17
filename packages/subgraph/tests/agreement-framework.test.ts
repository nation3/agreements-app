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

const AGREEMENT_JOINED_EVENT_SAMPLE_3 = createAgreementJoinedEvent(
  Bytes.fromI32(201),
  Address.fromString(ADDRESS_SAMPLE_1),
  BigInt.fromI32(1190)
);

const AGREEMENT_JOINED_EVENT_SAMPLE_4 = createAgreementJoinedEvent(
  Bytes.fromI32(201),
  Address.fromString(ADDRESS_SAMPLE_2),
  BigInt.fromI32(1290)
);

const AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_1 = createAgreementPositionUpdatedEvent(
  Bytes.fromI32(200),
  Address.fromString(ADDRESS_SAMPLE_1),
  BigInt.fromI32(5000),
  BigInt.fromI32(0)
);

const AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_2 = createAgreementPositionUpdatedEvent(
  Bytes.fromI32(200),
  Address.fromString(ADDRESS_SAMPLE_1),
  BigInt.fromI32(1050),
  BigInt.fromI32(1)
);

const AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_3 = createAgreementPositionUpdatedEvent(
  Bytes.fromI32(200),
  Address.fromString(ADDRESS_SAMPLE_2),
  BigInt.fromI32(1090),
  BigInt.fromI32(1)
);

const AGREEMENT_FINALIZED_EVENT_SAMPLE_1 = createAgreementFinalizedEvent(
  Bytes.fromI32(200)
);

const AGREEMENT_DISPUTED_EVENT_SAMPLE_1 = createAgreementDisputedEvent(
  Bytes.fromI32(200),
  Address.fromString(ADDRESS_SAMPLE_1)
);

describe("handling of AgreementCreated", () => {
  afterEach(() => {
    clearStore();
  });

  test("1 AgreementCreated", () => {
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    
    assert.entityCount("Agreement", 1);
    
    assertAgreement("0xc8000000","0xd2029649","1000","[]","Created","Metadata");
  });

  test("2 AgreementCreated", () => {
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

    test("1 AgreementJoined", () => {
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
      
      assert.entityCount("Agreement", 1);
      assert.entityCount("AgreementPosition", 1);
      
      assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]","Created","Metadata");
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Idle", "0xc8000000");
    });

    test("2 AgreementJoined", () => {
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_2);
      
      assert.entityCount("Agreement", 1);
      assert.entityCount("AgreementPosition", 2);
      
      assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]","Ongoing","Metadata");
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Idle", "0xc8000000");
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", ADDRESS_SAMPLE_2, "1090", "Idle", "0xc8000000");
    });
  });

  describe("2 Agreement", () => {
    afterEach(() => {
      clearStore();
    });

    beforeEach(() => {
      handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
      handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_2);
    });    

    test("1 AgreementJoined each", () => {
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_3);
      
      assert.entityCount("Agreement", 2);
      assert.entityCount("AgreementPosition", 2);
      
      assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]","Created","Metadata");
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Idle", "0xc8000000");
      
      assertAgreement("0xc9000000","0xd2029649","1100","[0xc90000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]","Created","Metadata");
      assertAgreementPosition("0xc90000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1190", "Idle", "0xc9000000");
    });

    test("2 AgreementJoined each", () => {
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_2);
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_3);
      handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_4);
      
      assert.entityCount("Agreement", 2);
      assert.entityCount("AgreementPosition", 4);

      assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]","Ongoing","Metadata");
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Idle", "0xc8000000");
      assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", ADDRESS_SAMPLE_2, "1090", "Idle", "0xc8000000");
      
      assertAgreement("0xc9000000","0xd2029649","1100","[0xc90000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 0xc90000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]","Ongoing","Metadata");
      assertAgreementPosition("0xc90000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1190", "Idle", "0xc9000000");
      assertAgreementPosition("0xc90000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", ADDRESS_SAMPLE_2, "1290", "Idle", "0xc9000000");
    });
  });
});

describe("handling of AgreementPositionUpdated", () => {
  afterEach(() => {
    clearStore();
  });

  beforeEach(() => {
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
  });

  test("when position balance changes", () => {
    handleAgreementPositionUpdated(AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_1);
    
    assert.entityCount("Agreement", 1);
    assert.entityCount("AgreementPosition", 1);
      
    assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]","Created","Metadata");
    assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "5000", "Idle", "0xc8000000");
  });

  test("when position status changes", () => {
    handleAgreementPositionUpdated(AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_2);
    
    assert.entityCount("Agreement", 1);
    assert.entityCount("AgreementPosition", 1);
      
    assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]","Created","Metadata");
    assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Finalized", "0xc8000000");
  });
});

describe("handling of AgreementFinalized", () => {
  afterEach(() => {
    clearStore();
  });

  beforeEach(() => {
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
    handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_2);
    handleAgreementPositionUpdated(AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_2);
    handleAgreementPositionUpdated(AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_3);
  });

  test("1 Agreement", () => {
    handleAgreementFinalized(AGREEMENT_FINALIZED_EVENT_SAMPLE_1);
    
    assert.entityCount("Agreement", 1);
    assert.entityCount("AgreementPosition", 2);

    assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]","Finalized","Metadata");
    assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Finalized", "0xc8000000");
    assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", ADDRESS_SAMPLE_2, "1090", "Finalized", "0xc8000000");
  });
});

describe("handling of AgreementDisputed", () => {
  afterEach(() => {
    clearStore();
  });

  beforeEach(() => {
    handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
    handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
    handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_2);
  });

  test("1 Agreement", () => {
    assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]","Ongoing","Metadata");

    handleAgreementDisputed(AGREEMENT_DISPUTED_EVENT_SAMPLE_1);
    
    assert.entityCount("Agreement", 1);
    assert.entityCount("AgreementPosition", 2);

    assertAgreement("0xc8000000","0xd2029649","1000","[0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]","Disputed","Metadata");
    assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", ADDRESS_SAMPLE_1, "1050", "Idle", "0xc8000000");
    assertAgreementPosition("0xc80000000x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", ADDRESS_SAMPLE_2, "1090", "Idle", "0xc8000000");
  });
});