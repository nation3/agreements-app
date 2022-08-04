import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { Agreement } from "../generated/schema"
import { AgreementCreated } from "../generated/AgreementFramework/AgreementFramework"
import { handleAgreementCreated, handleAgreementJoined } from "../src/agreement-framework"
import { createAgreementCreatedEvent, createAgreementJoinedEvent } from "./agreement-framework-utils"

describe("handle AgreementCreated", () => {
  
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let termsHash = Bytes.fromI32(1234567890)
    let criteria = BigInt.fromI32(234)
    let newAgreementCreatedEvent = createAgreementCreatedEvent(
      id,
      termsHash,
      criteria
    )
    handleAgreementCreated(newAgreementCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("Agreement created and stored", () => {
    assert.entityCount("Agreement", 1)
    assert.fieldEquals(
      "Agreement",
      "234",
      "termsHash",
      "0xd2029649"
    )
    assert.fieldEquals(
      "Agreement",
      "234",
      "criteria",
      "234"
    )
    assert.fieldEquals(
      "Agreement",
      "234",
      "status",
      "Created"
    )
  })
})

describe("handle AgreementJoined", () => {
  
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let termsHash = Bytes.fromI32(1234567890)
    let criteria = BigInt.fromI32(234)
    let newAgreementCreatedEvent = createAgreementCreatedEvent(
      id,
      termsHash,
      criteria
    )
    handleAgreementCreated(newAgreementCreatedEvent)
    let party = Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7")
    let balance = BigInt.fromI32(258)
    let newAgreementJoinedEvent = createAgreementJoinedEvent(
      id,
      party,
      balance
    )
    handleAgreementJoined(newAgreementJoinedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  test("Agreement and position created and stored", () => {
    assert.entityCount("Agreement", 1)
    assert.fieldEquals(
      "Agreement",
      "234",
      "termsHash",
      "0xd2029649"
    )
    assert.fieldEquals(
      "Agreement",
      "234",
      "criteria",
      "234"
    )
    assert.fieldEquals(
      "Agreement",
      "234",
      "status",
      "Created"
    )
    assert.entityCount("AgreementPosition", 1)
    assert.fieldEquals(
      "AgreementPosition",
      "0",
      "party",
      "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7"
    )
    assert.fieldEquals(
      "AgreementPosition",
      "0",
      "balance",
      "258"
    )
    assert.fieldEquals(
      "AgreementPosition",
      "0",
      "agreement",
      "234"
    )
    assert.fieldEquals(
      "AgreementPosition",
      "0",
      "status",
      "Idle"
    )
  })
})