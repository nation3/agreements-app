import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
    assert,
    describe,
    test,
    clearStore,
    afterAll,
    beforeEach,
    beforeAll
} from "matchstick-as/assembly/index"
import { handleResolutionSubmitted, handleResolutionAppealed, handleResolutionEndorsed, handleResolutionExecuted } from "../src/arbitrator"
import { createResolutionSubmittedEvent, createResolutionExecutedEvent, createResolutionAppealedEvent, createResolutionEndorsedEvent } from "./arbitrator-utils"
import { Dispute } from "../generated/schema"

const FRAMEWORK_ADDRESS = "0x8888888888888888888888888888888888888888";
const SAMPLE_ADDRESS = "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7";

const RESOLUTION_SUBMITTED_EVENT = createResolutionSubmittedEvent(
    Address.fromString(FRAMEWORK_ADDRESS),
    Bytes.fromI32(314),
    Bytes.fromI32(111)
)

const RESOLUTION_SUBMITTED_EVENT_2 = createResolutionSubmittedEvent(
    Address.fromString(FRAMEWORK_ADDRESS),
    Bytes.fromI32(314),
    Bytes.fromI32(112)
)

describe("handling of submitResolution", () => {
    beforeAll(() => {
        let dispute = new Dispute(Bytes.fromI32(314).toHexString())
        dispute.createdAt = BigInt.fromI32(0)
        dispute.save()
    })
    afterAll(() => {
        clearStore()
    })

    test("resolution submitted", () => {
        const submitted = RESOLUTION_SUBMITTED_EVENT

        handleResolutionSubmitted(submitted);

        assert.entityCount("Resolution", 1);

        assert.fieldEquals("Resolution", submitted.params.hash.toHexString(), "dispute", submitted.params.id.toHexString());
        assert.fieldEquals("Resolution", submitted.params.hash.toHexString(), "status", "Submitted");
        assert.fieldEquals("Dispute", submitted.params.id.toHexString(), "resolution", submitted.params.hash.toHexString());
    });

    describe("one resolution submitted", () => {
        beforeEach(() => {
            handleResolutionSubmitted(RESOLUTION_SUBMITTED_EVENT);
        });

        test("resolution appealed", () => {
            const appealed = createResolutionAppealedEvent(
                Bytes.fromI32(111),
                Address.fromString(SAMPLE_ADDRESS)
            )

            handleResolutionAppealed(appealed)

            assert.fieldEquals("Resolution", appealed.params.hash.toHexString(), "status", "Appealed");
        });

        test("resolution endorsed", () => {
            const endorsed = createResolutionEndorsedEvent(
                Bytes.fromI32(111)
            )

            handleResolutionEndorsed(endorsed)

            assert.fieldEquals("Resolution", endorsed.params.hash.toHexString(), "status", "Endorsed");
        });

        test("resolution executed", () => {
            const executed = createResolutionExecutedEvent(
                Bytes.fromI32(111)
            )

            handleResolutionExecuted(executed)

            assert.fieldEquals("Resolution", executed.params.hash.toHexString(), "status", "Executed");
        });

        test("new resolution submitted", () => {
            const submitted_1 = RESOLUTION_SUBMITTED_EVENT
            const submitted_2 = RESOLUTION_SUBMITTED_EVENT_2

            assert.fieldEquals("Dispute", submitted_1.params.id.toHexString(), "resolution", submitted_1.params.hash.toHexString());

            handleResolutionSubmitted(submitted_2)

            assert.entityCount("Resolution", 2);
            assert.fieldEquals("Dispute", submitted_1.params.id.toHexString(), "resolution", submitted_2.params.hash.toHexString());
        });
    });
})
