import {
    assert,
    describe,
    test,
    clearStore,
    afterEach,
    beforeEach,
} from "matchstick-as/assembly/index";
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts";
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

    test("one agreement created", () => {
        const created = AGREEMENT_CREATED_EVENT_SAMPLE_1.params;

        handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);

        assert.entityCount("Agreement", 1);

        assertAgreement(created.id.toHexString(), created.termsHash.toHexString(), created.criteria.toString(), "Created", created.metadataURI.toString());
    });

    test("two agreement created", () => {
        const created = AGREEMENT_CREATED_EVENT_SAMPLE_1.params;
        const created2 = AGREEMENT_CREATED_EVENT_SAMPLE_2.params;

        handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
        handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_2);

        assert.entityCount("Agreement", 2);

        assertAgreement(created.id.toHexString(), created.termsHash.toHexString(), created.criteria.toString(), "Created", created.metadataURI.toString());

        assertAgreement(created2.id.toHexString(), created2.termsHash.toHexString(), created2.criteria.toString(), "Created", created2.metadataURI.toString());
    });
});

describe("handling of AgreementJoined", () => {

    describe("one agreement created", () => {

        afterEach(() => {
            clearStore();
        });

        beforeEach(() => {
            handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
        });

        test("agreement joined once", () => {
            let created = AGREEMENT_CREATED_EVENT_SAMPLE_1.params;
            let joined = AGREEMENT_JOINED_EVENT_SAMPLE_1.params;

            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);

            assert.entityCount("Agreement", 1);
            assert.entityCount("AgreementPosition", 1);

            let positionId = joined.id.toHexString().concat(joined.party.toHexString());

            assertAgreement(created.id.toHexString(), created.termsHash.toHexString(), created.criteria.toString(), "Ongoing", created.metadataURI.toString());

            assertAgreementPosition(positionId, joined.party.toHexString(), joined.balance.toString(), "Joined", joined.id.toHexString())
        });

        test("agreement joined twice", () => {
            let created = AGREEMENT_CREATED_EVENT_SAMPLE_1.params;
            let joined = AGREEMENT_JOINED_EVENT_SAMPLE_1.params;
            let joined2 = AGREEMENT_JOINED_EVENT_SAMPLE_2.params;

            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_2);

            assert.entityCount("Agreement", 1);
            assert.entityCount("AgreementPosition", 2);

            assertAgreement(created.id.toHexString(), created.termsHash.toHexString(), created.criteria.toString(), "Ongoing", created.metadataURI.toString());
            assertAgreementPosition(joined.id.toHexString().concat(joined.party.toHexString()), joined.party.toHexString(), joined.balance.toString(), "Joined", joined.id.toHexString())
            assertAgreementPosition(joined2.id.toHexString().concat(joined2.party.toHexString()), joined2.party.toHexString(), joined2.balance.toString(), "Joined", joined2.id.toHexString())
        });
    });

    describe("two agreemeents created", () => {

        afterEach(() => {
            clearStore();
        });

        beforeEach(() => {
            handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_1);
            handleAgreementCreated(AGREEMENT_CREATED_EVENT_SAMPLE_2);
        });

        test("each agreement joined once", () => {
            let created = AGREEMENT_CREATED_EVENT_SAMPLE_1.params;
            let created2 = AGREEMENT_CREATED_EVENT_SAMPLE_2.params;
            let joined = AGREEMENT_JOINED_EVENT_SAMPLE_1.params;
            let joined3 = AGREEMENT_JOINED_EVENT_SAMPLE_3.params;

            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_3);

            assert.entityCount("Agreement", 2);
            assert.entityCount("AgreementPosition", 2);

            assertAgreement(created.id.toHexString(), created.termsHash.toHexString(), created.criteria.toString(), "Ongoing", created.metadataURI.toString());
            assertAgreement(created2.id.toHexString(), created2.termsHash.toHexString(), created2.criteria.toString(), "Ongoing", created2.metadataURI.toString());
            assertAgreementPosition(joined.id.toHexString().concat(joined.party.toHexString()), joined.party.toHexString(), joined.balance.toString(), "Joined", joined.id.toHexString())
            assertAgreementPosition(joined3.id.toHexString().concat(joined3.party.toHexString()), joined3.party.toHexString(), joined3.balance.toString(), "Joined", joined3.id.toHexString())
        });

        test("each agreement joined twice", () => {
            let joined = AGREEMENT_JOINED_EVENT_SAMPLE_1.params;
            let joined2 = AGREEMENT_JOINED_EVENT_SAMPLE_2.params;
            let joined3 = AGREEMENT_JOINED_EVENT_SAMPLE_3.params;
            let joined4 = AGREEMENT_JOINED_EVENT_SAMPLE_4.params;

            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_1);
            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_2);
            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_3);
            handleAgreementJoined(AGREEMENT_JOINED_EVENT_SAMPLE_4);

            assert.entityCount("Agreement", 2);
            assert.entityCount("AgreementPosition", 4);

            assertAgreementPosition(joined.id.toHexString().concat(joined.party.toHexString()), joined.party.toHexString(), joined.balance.toString(), "Joined", joined.id.toHexString())
            assertAgreementPosition(joined2.id.toHexString().concat(joined2.party.toHexString()), joined2.party.toHexString(), joined2.balance.toString(), "Joined", joined2.id.toHexString())
            assertAgreementPosition(joined3.id.toHexString().concat(joined3.party.toHexString()), joined3.party.toHexString(), joined3.balance.toString(), "Joined", joined3.id.toHexString())
            assertAgreementPosition(joined4.id.toHexString().concat(joined4.party.toHexString()), joined4.party.toHexString(), joined4.balance.toString(), "Joined", joined4.id.toHexString())
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

    test("position balance changes", () => {
        let updated = AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_1.params;

        handleAgreementPositionUpdated(AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_1);

        assert.entityCount("Agreement", 1);
        assert.entityCount("AgreementPosition", 1);

        assertAgreementPosition(updated.id.toHexString().concat(updated.party.toHexString()), updated.party.toHexString(), updated.balance.toString(), "Joined", updated.id.toHexString());
    });

    test("position status changes", () => {
        let updated = AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_2.params;

        handleAgreementPositionUpdated(AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_2);

        assert.entityCount("Agreement", 1);
        assert.entityCount("AgreementPosition", 1);

        assertAgreementPosition(updated.id.toHexString().concat(updated.party.toHexString()), updated.party.toHexString(), updated.balance.toString(), "Finalized", updated.id.toHexString());
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

    test("one agremeent finalized", () => {
        let created = AGREEMENT_CREATED_EVENT_SAMPLE_1.params;
        let updated2 = AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_2.params;
        let updated3 = AGREEMENT_POSITION_UPDATED_EVENT_SAMPLE_3.params;

        handleAgreementFinalized(AGREEMENT_FINALIZED_EVENT_SAMPLE_1);

        assert.entityCount("Agreement", 1);
        assert.entityCount("AgreementPosition", 2);

        assertAgreement(created.id.toHexString(), created.termsHash.toHexString(), created.criteria.toString(), "Finalized", created.metadataURI.toString());
        assertAgreementPosition(updated2.id.toHexString().concat(updated2.party.toHexString()), updated2.party.toHexString(), updated2.balance.toString(), "Finalized", updated2.id.toHexString());
        assertAgreementPosition(updated3.id.toHexString().concat(updated3.party.toHexString()), updated3.party.toHexString(), updated3.balance.toString(), "Finalized", updated3.id.toHexString());
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

    test("one agreement disputed", () => {
        let created = AGREEMENT_CREATED_EVENT_SAMPLE_1.params;
        let joined = AGREEMENT_JOINED_EVENT_SAMPLE_1.params;
        let joined2 = AGREEMENT_JOINED_EVENT_SAMPLE_2.params;

        assertAgreement(created.id.toHexString(), created.termsHash.toHexString(), created.criteria.toString(), "Ongoing", created.metadataURI.toString());

        handleAgreementDisputed(AGREEMENT_DISPUTED_EVENT_SAMPLE_1);

        assert.entityCount("Agreement", 1);
        assert.entityCount("AgreementPosition", 2);
        assert.entityCount("Dispute", 1);

        assertAgreement(created.id.toHexString(), created.termsHash.toHexString(), created.criteria.toString(), "Disputed", created.metadataURI.toString());

        assertAgreementPosition(joined.id.toHexString().concat(joined.party.toHexString()), joined.party.toHexString(), joined.balance.toString(), "Joined", joined.id.toHexString())
        assertAgreementPosition(joined2.id.toHexString().concat(joined2.party.toHexString()), joined2.party.toHexString(), joined2.balance.toString(), "Joined", joined2.id.toHexString())

        assert.fieldEquals("Dispute", created.id.toHexString(), "agreement", created.id.toHexString());
    });
});
