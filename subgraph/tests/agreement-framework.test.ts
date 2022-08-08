import {
  assert,
  describe,
  test,
  clearStore,
  afterEach
} from "matchstick-as/assembly/index"
import { logStore } from 'matchstick-as/assembly/store'
import { BigInt, Bytes, Address } from "@graphprotocol/graph-ts"
import { Agreement } from "../generated/schema"
import { AgreementCreated } from "../generated/AgreementFramework/AgreementFramework"
import { handleAgreementCreated, handleAgreementJoined } from "../src/agreement-framework"
import { 
  createAgreementCreatedEvent, 
  createAgreementJoinedEvent, 
  assertAgreement, 
  assertAgreementPosition
} from "./agreement-framework-utils"

describe("handling of AgreementCreated", () => {
  afterEach(() => {
    clearStore()
  })

  test("1 AgreementCreated event", () => {
    let newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(200), Bytes.fromI32(1234567890), BigInt.fromI32(1000))
    handleAgreementCreated(newAgreementCreatedEvent)

    assert.entityCount("Agreement", 1)
    assertAgreement("200", "0xd2029649", "1000", "[]", "Created")
  })

  test("2 AgreementCreated event", () => {
    let newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(200), Bytes.fromI32(1234567890), BigInt.fromI32(1000))
    handleAgreementCreated(newAgreementCreatedEvent)

    newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(201), Bytes.fromI32(1234567890), BigInt.fromI32(1100))
    handleAgreementCreated(newAgreementCreatedEvent)

    assert.entityCount("Agreement", 2)
    
    assertAgreement("200", "0xd2029649", "1000", "[]", "Created")
    assertAgreement("201", "0xd2029649", "1100", "[]", "Created")
  })
})
  
describe("handling of AgreementJoined", () => {
  afterEach(() => {
    clearStore()
  })

  test("1 Agreement 1 AgreementPosition", () => {
    let newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(200), Bytes.fromI32(1234567890), BigInt.fromI32(1000))
    handleAgreementCreated(newAgreementCreatedEvent)

    let newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(200), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7"), BigInt.fromI32(1000))
    handleAgreementJoined(newAgreementJoinedEvent)    

    assert.entityCount("Agreement", 1)
    assert.entityCount("AgreementPosition", 1)

    assertAgreement("200", "0xd2029649", "1000", "[200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]", "Created")
    assertAgreementPosition("200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", "1000", "Idle", "200")
  })

  test("1 Agreement 2 AgreementPosition", () => {
    let newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(200), Bytes.fromI32(1234567890), BigInt.fromI32(1000))
    handleAgreementCreated(newAgreementCreatedEvent)

    let newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(200), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7"), BigInt.fromI32(1000))
    handleAgreementJoined(newAgreementJoinedEvent)

    newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(200), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8"), BigInt.fromI32(1050))
    handleAgreementJoined(newAgreementJoinedEvent)    

    assert.entityCount("Agreement", 1)
    assert.entityCount("AgreementPosition", 2)

    assertAgreement("200", "0xd2029649", "1000", "[200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]", "Created")
    assertAgreementPosition("200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", "1000", "Idle", "200")
    assertAgreementPosition("200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", "1050", "Idle", "200")
  })

  test("2 Agreement 1 AgreementPosition", () => {
    let newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(200), Bytes.fromI32(1234567890), BigInt.fromI32(1000))
    handleAgreementCreated(newAgreementCreatedEvent)

    newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(201), Bytes.fromI32(1234567890), BigInt.fromI32(2000))
    handleAgreementCreated(newAgreementCreatedEvent)

    let newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(200), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7"), BigInt.fromI32(1000))
    handleAgreementJoined(newAgreementJoinedEvent)

    newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(201), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8"), BigInt.fromI32(2050))
    handleAgreementJoined(newAgreementJoinedEvent)

    assert.entityCount("Agreement", 2)
    assert.entityCount("AgreementPosition", 2)

    assertAgreement("200", "0xd2029649", "1000", "[200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7]", "Created")
    assertAgreement("201", "0xd2029649", "2000", "[201-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]", "Created")
    assertAgreementPosition("200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", "1000", "Idle", "200")
    assertAgreementPosition("201-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", "2050", "Idle", "201")
  })

  test("2 Agreement 2 AgreementPosition", () => {
    let newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(200), Bytes.fromI32(1234567890), BigInt.fromI32(1000))
    handleAgreementCreated(newAgreementCreatedEvent)

    newAgreementCreatedEvent = createAgreementCreatedEvent(BigInt.fromI32(201), Bytes.fromI32(1234567890), BigInt.fromI32(2000))
    handleAgreementCreated(newAgreementCreatedEvent)

    let newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(200), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7"), BigInt.fromI32(1000))
    handleAgreementJoined(newAgreementJoinedEvent)

    newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(200), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8"), BigInt.fromI32(1050))
    handleAgreementJoined(newAgreementJoinedEvent)

    newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(201), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e9"), BigInt.fromI32(2000))
    handleAgreementJoined(newAgreementJoinedEvent)

    newAgreementJoinedEvent = createAgreementJoinedEvent(BigInt.fromI32(201), Address.fromString("0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43ea"), BigInt.fromI32(2050))
    handleAgreementJoined(newAgreementJoinedEvent)

    assert.entityCount("Agreement", 2)
    assert.entityCount("AgreementPosition", 4)

    assertAgreement("200", "0xd2029649", "1000", "[200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7, 200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8]", "Created")
    assertAgreement("201", "0xd2029649", "2000", "[201-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e9, 201-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43ea]", "Created")
    assertAgreementPosition("200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e7", "1000", "Idle", "200")
    assertAgreementPosition("200-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e8", "1050", "Idle", "200")
    assertAgreementPosition("201-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e9", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43e9", "2000", "Idle", "201")
    assertAgreementPosition("201-0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43ea", "0x89205a3a3b2a69de6dbf7f01ed13b2108b2c43ea", "2050", "Idle", "201")
  })
})